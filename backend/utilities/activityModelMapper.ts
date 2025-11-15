import { QuestionType } from "../types/activityTypes";
import {
  MatchingActivityModel,
  MultipleChoiceActivityModel,
  MultiSelectActivityModel,
  TableActivityModel,
} from "../models/activity.mgmodel";

export const activityModelMapper = {
  [QuestionType.MultipleChoice]: MultipleChoiceActivityModel,
  [QuestionType.MultiSelect]: MultiSelectActivityModel,
  [QuestionType.Table]: TableActivityModel,
  [QuestionType.Matching]: MatchingActivityModel,
};
