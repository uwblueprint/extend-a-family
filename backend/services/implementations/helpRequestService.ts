/* eslint-disable class-methods-use-this */
import { ObjectId } from "mongoose";
import { IHelpRequestService } from "../interfaces/helpRequestService";
import MgHelpRequest, { HelpRequest } from "../../models/helprequest.mgmodel";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";
import {
  CreateHelpRequestDTO,
  HelpRequestDTO,
  UpdateHelpRequestDTO,
} from "../../types/helpRequestTypes";

const Logger = logger(__filename);

export class HelpRequestService implements IHelpRequestService {
  async getHelpRequest(
    requestId: string,
    userId: ObjectId,
  ): Promise<HelpRequestDTO> {
    try {
      const helpRequest = await MgHelpRequest.findById(requestId);
      if (!helpRequest) {
        throw Error(`Help request with id ${requestId} doesn't exist`);
      }
      // without .toString, facilitator is in form of new ObjectId('id')
      // and userId is just in form of 'id
      if (helpRequest.facilitator.toString() !== userId.toString()) {
        throw Error(`You are not allowed to view this help request`);
      }
      return helpRequest;
    } catch (error) {
      Logger.error(
        `Failed to retrieve help request. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async getHelpRequests(userId: ObjectId): Promise<HelpRequestDTO[]> {
    try {
      const helpRequests = await MgHelpRequest.find({
        facilitator: userId,
      })
        .populate("learner", "firstName lastName")
        .populate("unit", "title displayIndex")
        .populate("module", "title displayIndex")
        .populate("page", "title")
        .sort({
          createdAt: -1,
        });
      return helpRequests;
    } catch (error) {
      Logger.error(
        `Failed to retrieve help requests. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createHelpRequest(
    helpRequest: CreateHelpRequestDTO,
  ): Promise<HelpRequestDTO> {
    let createdHelpRequest: HelpRequest;
    try {
      createdHelpRequest = await MgHelpRequest.create({ ...helpRequest });
    } catch (error) {
      Logger.error(
        `Failed to create help request. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return createdHelpRequest;
  }

  async updateHelpRequest(requestId: string, updates: UpdateHelpRequestDTO) {
    let oldHelpRequest: HelpRequest | null;
    try {
      oldHelpRequest = await MgHelpRequest.findByIdAndUpdate(
        requestId,
        { $set: updates }, // Only update the fields provided in `updateData`
        { new: true, omitUndefined: true },
      )
        .populate("learner", "firstName lastName")
        .populate("unit", "title displayIndex")
        .populate("module", "title displayIndex")
        .populate("page", "title");

      if (!oldHelpRequest) {
        throw new Error(`Help Request with id ${requestId} not found.`);
      }
    } catch (error) {
      Logger.error(
        `Failed to update help request. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: oldHelpRequest.id,
      message: oldHelpRequest.message,
      learner: oldHelpRequest.learner,
      facilitator: oldHelpRequest.facilitator,
      unit: updates.unit ?? oldHelpRequest.unit,
      module: updates.module ?? oldHelpRequest.module,
      page: updates.page ?? oldHelpRequest.page,
      completed: updates.completed ?? oldHelpRequest.completed,
      createdAt: oldHelpRequest.createdAt,
    };
  }
}
