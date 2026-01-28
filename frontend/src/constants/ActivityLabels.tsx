import {
  AccountTreeOutlined,
  Subject,
  TableChartOutlined,
} from "@mui/icons-material";
import React from "react";
import { QuestionType } from "../types/CourseTypes";

export const questionTypeIcons: Record<QuestionType, React.ReactNode> = {
  [QuestionType.MultipleChoice]: <AccountTreeOutlined />,
  [QuestionType.MultiSelect]: <AccountTreeOutlined />,
  [QuestionType.Table]: <TableChartOutlined />,
  [QuestionType.Matching]: <AccountTreeOutlined />,
  [QuestionType.Input]: <Subject />,
};

export const questionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.MultipleChoice]: "Multiple Choice",
  [QuestionType.MultiSelect]: "Multi Select",
  [QuestionType.Table]: "Table",
  [QuestionType.Matching]: "Matching",
  [QuestionType.Input]: "Short Answer",
};
