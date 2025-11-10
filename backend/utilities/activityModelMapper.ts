import { QuestionType } from "../types/activityTypes";
import {
  MultipleChoiceActivityModel,
  MultiSelectActivityModel,
  TableActivityModel,
} from "../models/activity.mgmodel";

export const activityModelMapper = {
  [QuestionType.MultipleChoice]: MultipleChoiceActivityModel,
  [QuestionType.MultiSelect]: MultiSelectActivityModel,
  [QuestionType.Table]: TableActivityModel,
};
