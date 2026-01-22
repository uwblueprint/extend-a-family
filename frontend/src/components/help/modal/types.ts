import { Theme } from "@mui/material/styles";
import { CourseModule, CoursePageBase } from "../../../types/CourseTypes";

export interface NeedHelpModalProps {
  open: boolean;
  onClose: () => void;
  module: CourseModule | null;
  currentPage: CoursePageBase | null;
}

export type ModalScreen = "home" | "content" | "confirmation" | "error";

export interface ModalHandlers {
  handleContentClick: () => void;
  handleNavigationClick: () => void;
  handleBackToHome: () => void;
  handleNext: () => Promise<void>;
  handleBackToContent: () => void;
  handleClose: () => void;
}

export interface ModalState {
  currentScreen: ModalScreen;
  helpText: string;
  isSubmitting: boolean;
  setCurrentScreen: (screen: ModalScreen) => void;
  setHelpText: (text: string) => void;
  setIsSubmitting: (submitting: boolean) => void;
}

export interface CommonContentProps {
  handleContentClick: () => void;
  handleNavigationClick: () => void;
  handleBackToHome: () => void;
  handleNext: () => Promise<void>;
  handleBackToContent: () => void;
  handleClose: () => void;
  helpText: string;
  setHelpText: (text: string) => void;
  isSubmitting: boolean;
  theme: Theme;
}
