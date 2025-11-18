import { QuestionType } from "../types/activityTypes";
import {
  MatchingActivityModel,
  MultipleChoiceActivityModel,
  MultiSelectActivityModel,
  TableActivityModel,
  TextInputActivityModel,
} from "../models/activity.mgmodel";

export const activityModelMapper = {
  [QuestionType.MultipleChoice]: MultipleChoiceActivityModel,
  [QuestionType.MultiSelect]: MultiSelectActivityModel,
  [QuestionType.Matching]: MatchingActivityModel,
  [QuestionType.Table]: TableActivityModel,
  [QuestionType.TextInput]: TextInputActivityModel,
};
