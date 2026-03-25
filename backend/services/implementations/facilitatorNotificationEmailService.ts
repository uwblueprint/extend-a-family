import { escape } from "html-escaper";
import { ObjectId, Schema } from "mongoose";
import {
  defaultFrontendUrl,
  defaultLogoURL,
  emailSettingsPath,
} from "../../emails/constants";
import { buildFacilitatorEmailNotificationTemplate } from "../../emails/facilitatorEmailNotification";
import { buildMultiMessage } from "../../emails/multiMessageTemplate";
import { buildSingleMessage } from "../../emails/singleMessageTemplate";
import MgCourseModule from "../../models/coursemodule.mgmodel";
import CoursePageModel from "../../models/coursepage.mgmodel";
import MgCourseUnit from "../../models/courseunit.mgmodel";
import MgHelpRequest from "../../models/helprequest.mgmodel";
import MgNotification, {
  Notification,
} from "../../models/notification.mgmodel";
import MgUser, { FacilitatorModel } from "../../models/user.mgmodel";
import { EnrichedNotificationData } from "../../types/facilitatorNotificationTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import IEmailService from "../interfaces/emailService";
import IFacilitatorNotificationEmailService from "../interfaces/facilitatorNotificationEmailService";

const Logger = logger(__filename);

function generateInitialsAvatarUrl(
  firstName: string,
  lastName: string,
): string {
  const safeName = `${firstName || ""} ${lastName || ""}`.trim() || "User";
  const name = encodeURIComponent(safeName);
  return `https://ui-avatars.com/api/?name=${name}&background=E3F9FC&color=006C7D&size=48&font-size=0.4&bold=true&rounded=true`;
}

class FacilitatorNotificationEmailService
  implements IFacilitatorNotificationEmailService
{
  emailService: IEmailService;

  constructor(emailService: IEmailService) {
    this.emailService = emailService;
  }

  async sendPendingNotificationEmails(facilitatorId: string): Promise<void> {
    try {
      const facilitator = await FacilitatorModel.findById(facilitatorId);
      if (!facilitator) {
        Logger.error(`Facilitator with id ${facilitatorId} not found`);
        return;
      }

      const unsentNotifications = await MgNotification.find({
        user: facilitatorId,
        emailSent: false,
      })
        .sort({ createdAt: -1 })
        .exec();

      if (unsentNotifications.length === 0) {
        return;
      }

      const threshold = facilitator.emailPrefrence ?? 1;

      // if threshold is -1, the user never wants to receive email notifications
      if (threshold < 0) return;

      if (unsentNotifications.length < threshold) {
        return;
      }

      const notificationsToSend = unsentNotifications;

      const enrichedData =
        await FacilitatorNotificationEmailService.gatherNotificationData(
          notificationsToSend,
        );

      if (enrichedData.length === 0) {
        Logger.warn(
          `No valid notification data to send for facilitator ${facilitatorId}`,
        );
        return;
      }

      if (enrichedData.length < threshold) {
        Logger.warn(
          `Only ${enrichedData.length} of ${threshold} notifications could be enriched for facilitator ${facilitatorId}`,
        );
      }

      const emailHtml =
        await FacilitatorNotificationEmailService.buildEmailHtml(
          facilitator.firstName,
          enrichedData,
          threshold,
        );

      const emailSubject =
        threshold === 1
          ? `New message from ${enrichedData[0].learnerName}`
          : `You have ${enrichedData.length} new messages`;

      Logger.info(
        `Attempting to send email to ${facilitator.email} with ${enrichedData.length} messages`,
      );

      await this.emailService.sendEmail(
        facilitator.email,
        emailSubject,
        emailHtml,
      );

      Logger.info(`Email sent successfully to ${facilitator.email}`);

      const successfulNotificationIds = enrichedData.map(
        (data) => data.notificationId,
      );
      await MgNotification.updateMany(
        { _id: { $in: successfulNotificationIds } },
        { $set: { emailSent: true } },
      );

      Logger.info(
        `Sent email notification to facilitator ${facilitatorId} with ${enrichedData.length} messages (${successfulNotificationIds.length} notifications marked as sent)`,
      );
    } catch (error: unknown) {
      Logger.error(
        `Failed to send pending notification emails to facilitator ${facilitatorId}. Reason = ${getErrorMessage(
          error,
        )}`,
      );
      throw error;
    }
  }

  private static async gatherNotificationData(
    notifications: Notification[],
  ): Promise<EnrichedNotificationData[]> {
    const enrichedDataPromises = notifications.map(async (notification) => {
      try {
        const helpRequest = await MgHelpRequest.findById(
          notification.helpRequest,
        )
          .populate("learner")
          .exec();

        if (!helpRequest) {
          Logger.warn(
            `HelpRequest ${notification.helpRequest} not found for notification ${notification.id}`,
          );
          return null;
        }

        const learner = await MgUser.findById(helpRequest.learner);
        if (!learner) {
          Logger.warn(`Learner ${helpRequest.learner} not found`);
          return null;
        }

        const unit = await MgCourseUnit.findById(helpRequest.unit);
        if (!unit) {
          Logger.warn(`Unit ${helpRequest.unit} not found`);
          return null;
        }

        const module = await MgCourseModule.findById(helpRequest.module);
        if (!module) {
          Logger.warn(`Module ${helpRequest.module} not found`);
          return null;
        }

        const page = await CoursePageModel.findById(helpRequest.page);
        if (!page) {
          Logger.warn(`Page ${helpRequest.page} not found`);
          return null;
        }

        const moduleIndex = unit.modules.findIndex(
          (m: Schema.Types.ObjectId) => m.toString() === module.id.toString(),
        );
        const moduleNumber = (moduleIndex + 1).toString();

        const learnerName = `${learner.firstName} ${learner.lastName}`;
        const learnerProfilePicture =
          learner.profilePicture ||
          generateInitialsAvatarUrl(learner.firstName, learner.lastName);

        const moduleLink = `${defaultFrontendUrl}/view-page?moduleId=${module.id}&pageId=${page.id}`;
        const respondLink = `mailto:${learner.email}?subject=Your help request for ${module.title}&body=Hi ${learner.firstName},%0D%0A%0D%0AI am responding to your help request for Unit ${unit.displayIndex} Module ${module.displayIndex}: ${module.title} - ${page.title} on Smart Saving Smart Spending.%0D%0A%0D%0A[Write your message here]%0D%0A%0D%0ABest regards,%0D%0A[Your Name]`;

        const { messageDate, messageTime } =
          FacilitatorNotificationEmailService.formatDateTime(
            helpRequest.createdAt,
          );

        return {
          notificationId: notification.id as ObjectId,
          helpRequestId: helpRequest.id as ObjectId,
          message: escape(helpRequest.message),
          createdAt: helpRequest.createdAt,
          learnerName: escape(learnerName),
          learnerProfilePicture,
          moduleTitle: escape(module.title),
          moduleNumber,
          modulePage: escape(page.title),
          unitId: unit.id.toString(),
          moduleId: module.id.toString(),
          moduleLink,
          respondLink,
          messageDate,
          messageTime,
        };
      } catch (error: unknown) {
        Logger.error(
          `Failed to gather data for notification ${
            notification.id
          }. Reason = ${getErrorMessage(error)}`,
        );
        return null;
      }
    });

    const results = await Promise.all(enrichedDataPromises);
    return results.filter(
      (data): data is EnrichedNotificationData => data !== null,
    );
  }

  private static formatDateTime(date: Date): {
    messageDate: string;
    messageTime: string;
  } {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const messageDate = `${month} ${day}`;

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
    const messageTime = `${hours}:${minutesStr} ${ampm}`;

    return { messageDate, messageTime };
  }

  private static async buildEmailHtml(
    facilitatorName: string,
    enrichedData: EnrichedNotificationData[],
    threshold: number,
  ): Promise<string> {
    let messageBlock = "";
    let introSentence = "";

    if (threshold === 1) {
      const data = enrichedData[0];
      introSentence = `You have one new message from ${data.learnerName}`;

      messageBlock = buildSingleMessage({
        messageBody: `<p style="margin: 0">${data.message}</p>`,
        moduleLink: data.moduleLink,
        moduleNumber: data.moduleNumber,
        moduleName: data.moduleTitle,
        modulePage: data.modulePage,
        messageDate: data.messageDate,
        messageTime: data.messageTime,
        respondLink: data.respondLink,
      });
    } else {
      const messageCount = enrichedData.length;
      introSentence =
        messageCount === 1
          ? `You have one new message`
          : `You have ${messageCount} new messages`;

      messageBlock = enrichedData
        .map((data) =>
          buildMultiMessage({
            learnerProfilePicture: data.learnerProfilePicture,
            learnerName: data.learnerName,
            messageDate: data.messageDate,
            messageTime: data.messageTime,
            messageBody: `<p style="margin: 0">${data.message}</p>`,
            moduleLink: data.moduleLink,
            moduleNumber: data.moduleNumber,
            moduleName: data.moduleTitle,
            modulePage: data.modulePage,
            respondLink: data.respondLink,
          }),
        )
        .join("\n");
    }

    const emailSettingsLink = `${defaultFrontendUrl}${emailSettingsPath}`;

    return buildFacilitatorEmailNotificationTemplate({
      EAFLogo: defaultLogoURL,
      facilitatorName,
      introSentence,
      emailSettingsLink,
      messageBlock,
    });
  }
}

export default FacilitatorNotificationEmailService;
