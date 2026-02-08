import {
  MatchingActivityModel,
  MultipleChoiceActivityModel,
  MultiSelectActivityModel,
  TableActivityModel,
  TextInputActivityModel,
} from "../models/activity.mgmodel";
import { QuestionType } from "../types/activityTypes";

export const activityModelMapper = {
  [QuestionType.MultipleChoice]: MultipleChoiceActivityModel,
  [QuestionType.MultiSelect]: MultiSelectActivityModel,
  [QuestionType.Table]: TableActivityModel,
  [QuestionType.Matching]: MatchingActivityModel,
  [QuestionType.TextInput]: TextInputActivityModel,
};
