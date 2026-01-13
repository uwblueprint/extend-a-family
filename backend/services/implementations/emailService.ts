import nodemailer, { Transporter } from "nodemailer";
import IEmailService from "../interfaces/emailService";
import { NodemailerConfig } from "../../types/authTypes";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class EmailService implements IEmailService {
  transporter: Transporter;

  sender: string;

  constructor(nodemailerConfig: NodemailerConfig, displayName?: string) {
    this.transporter = nodemailer.createTransport(nodemailerConfig);
    if (displayName) {
      this.sender = `${displayName} <${nodemailerConfig.auth.user}>`;
    } else {
      this.sender = nodemailerConfig.auth.user;
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    replyTo?: string,
  ): Promise<void> {
    try {
      return await this.transporter.sendMail({
        from: this.sender,
        to,
        subject,
        html: htmlBody,
        replyTo,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to send email. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default EmailService;
