import { QuestionType } from "../types/activityTypes";
import {
  MultipleChoiceActivityModel,
  MultiSelectActivityModel,
} from "../models/activity.mgmodel";

export const activityModelMapper = {
  [QuestionType.MultipleChoice]: MultipleChoiceActivityModel,
  [QuestionType.MultiSelect]: MultiSelectActivityModel,
};
