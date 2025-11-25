import mongoose from "mongoose";
import ActivityService from "../activityService";
import { QuestionType } from "../../../types/activityTypes";
import CourseModuleModel from "../../../models/coursemodule.mgmodel";
import { TextInputActivityModel } from "../../../models/activity.mgmodel";

// Mock dependencies
jest.mock("../../../models/coursemodule.mgmodel");
jest.mock("../../../models/activity.mgmodel");

describe("ActivityService", () => {
    let session: mongoose.ClientSession;

    beforeEach(() => {
        session = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        } as unknown as mongoose.ClientSession;
        jest.spyOn(mongoose, "startSession").mockResolvedValue(session);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createActivity", () => {
        it("should create a TextInput activity with default values", async () => {
            const moduleId = "module-123";
            const questionType = QuestionType.TextInput;

            const mockActivity = {
                id: "activity-123",
                questionType,
                title: "New Activity",
                questionText: "Enter your question here",
                instruction: "Please select the correct answer",
                placeholder: "Enter your answer here",
                maxLength: 200,
                validation: {
                    mode: "short_answer",
                    answers: [],
                },
            };

            (TextInputActivityModel.create as jest.Mock).mockResolvedValue([mockActivity]);
            (CourseModuleModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({ pages: [mockActivity.id] }),
            });

            const result = await ActivityService.createActivity(moduleId, questionType);

            expect(TextInputActivityModel.create).toHaveBeenCalledWith(
                [expect.objectContaining({
                    questionType: QuestionType.TextInput,
                    placeholder: "Enter your answer here",
                })],
                { session }
            );
            expect(result.pages).toEqual([mockActivity.id]);
        });

        it("should create a TextInput activity with custom values", async () => {
            const moduleId = "module-123";
            const questionType = QuestionType.TextInput;
            const customData = {
                questionText: "Custom Question",
                placeholder: "Custom Placeholder",
            };

            const mockActivity = {
                id: "activity-123",
                questionType,
                ...customData,
            };

            (TextInputActivityModel.create as jest.Mock).mockResolvedValue([mockActivity]);
            (CourseModuleModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({ pages: [mockActivity.id] }),
            });

            const result = await ActivityService.createActivity(moduleId, questionType, undefined, customData);

            expect(TextInputActivityModel.create).toHaveBeenCalledWith(
                [expect.objectContaining({
                    questionType: QuestionType.TextInput,
                    questionText: "Custom Question",
                    placeholder: "Custom Placeholder",
                })],
                { session }
            );
            expect(result.pages).toEqual([mockActivity.id]);
        });
    });

    describe("updateActivity", () => {
        it("should update a TextInput activity", async () => {
            const activityId = "activity-123";
            const questionType = QuestionType.TextInput;
            const updateData = {
                questionText: "Updated Question",
                placeholder: "Updated Placeholder",
            };

            const mockUpdatedActivity = {
                id: activityId,
                ...updateData,
            };

            (TextInputActivityModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockUpdatedActivity),
            });

            const result = await ActivityService.updateActivity(activityId, questionType, updateData);

            expect(TextInputActivityModel.findByIdAndUpdate).toHaveBeenCalledWith(
                activityId,
                updateData,
                expect.objectContaining({ new: true, runValidators: true })
            );
            expect(result).toEqual(mockUpdatedActivity);
        });
    });

    describe("deleteActivity", () => {
        it("should delete a TextInput activity", async () => {
            const moduleId = "module-123";
            const activityId = "activity-123";
            const questionType = QuestionType.TextInput;

            (TextInputActivityModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});
            (CourseModuleModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({ pages: [] }),
            });

            const result = await ActivityService.deleteActivity(moduleId, activityId, questionType);

            expect(TextInputActivityModel.findByIdAndDelete).toHaveBeenCalledWith(
                activityId,
                { session }
            );
            expect(CourseModuleModel.findByIdAndUpdate).toHaveBeenCalledWith(
                moduleId,
                { $pull: { pages: activityId } },
                { new: true, session }
            );
            expect(result.pages).toEqual([]);
        });
    });
});
