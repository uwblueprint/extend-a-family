import React, { useState } from "react";
import { Dialog, Box, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../../hooks/useUser";
import { isAuthenticatedLearner } from "../../../types/AuthTypes";
import HelpRequestAPIClient from "../../../APIClients/HelpRequestAPIClient";
import { NeedHelpModalProps, ModalScreen } from "./types";
import HomeScreenContent from "./HomeScreenContent";
import ContentScreenContent from "./ContentScreenContent";
import ConfirmationScreenContent from "./ConfirmationScreenContent";
import ErrorScreenContent from "./ErrorScreenContent";

// Main modal component for help requests
const NeedHelpModal: React.FC<NeedHelpModalProps> = ({
  open,
  onClose,
  module,
  currentPage,
}) => {
  const theme = useTheme();
  const user = useUser();
  const [currentScreen, setCurrentScreen] = useState<ModalScreen>("home");
  const [helpText, setHelpText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContentClick = () => {
    setCurrentScreen("content");
  };

  const handleNavigationClick = () => {
    // TODO: Implement navigation help functionality
    onClose();
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setHelpText("");
  };

  const handleNext = async () => {
    if (!isAuthenticatedLearner(user)) {
      console.error("Only learners can submit help requests"); // eslint-disable-line no-console
      setCurrentScreen("error");
      return;
    }

    if (!module || !currentPage || !helpText.trim()) {
      console.error("Missing required information for help request"); // eslint-disable-line no-console
      setCurrentScreen("error");
      return;
    }

    if (!module.unitId) {
      console.error("Module unitId is missing"); // eslint-disable-line no-console
      setCurrentScreen("error");
      return;
    }

    setIsSubmitting(true);
    try {
      const helpRequest = await HelpRequestAPIClient.createHelpRequest(
        helpText.trim(),
        user.id,
        user.facilitator,
        module.unitId,
        module.id,
        currentPage.id,
      );

      if (helpRequest) {
        setCurrentScreen("confirmation");
      } else {
        console.error("Failed to create help request"); // eslint-disable-line no-console
        setCurrentScreen("error");
      }
    } catch (error) {
      console.error("Error creating help request:", error); // eslint-disable-line no-console
      setCurrentScreen("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentScreen("home");
    setHelpText("");
    onClose();
  };

  const handleBackToContent = () => {
    if (currentScreen === "confirmation") {
      // Close modal when going back to content from confirmation screen
      handleClose();
    } else {
      // For error screen, go back to content screen
      setCurrentScreen("content");
      setHelpText(""); // Reset help text like after a post request
      setIsSubmitting(false); // Reset submission state
    }
  };

  const renderContent = () => {
    switch (currentScreen) {
      case "content":
        return (
          <ContentScreenContent
            handleBackToHome={handleBackToHome}
            handleNext={handleNext}
            helpText={helpText}
            setHelpText={setHelpText}
            isSubmitting={isSubmitting}
            theme={theme}
          />
        );
      case "confirmation":
        return (
          <ConfirmationScreenContent
            handleBackToHome={handleBackToHome}
            handleBackToContent={handleBackToContent}
            theme={theme}
          />
        );
      case "error":
        return (
          <ErrorScreenContent
            handleBackToContent={handleBackToContent}
            theme={theme}
          />
        );
      default:
        return (
          <HomeScreenContent
            handleContentClick={handleContentClick}
            handleNavigationClick={handleNavigationClick}
            theme={theme}
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          display: "flex",
          width: "600px",
          height: "400px",
          padding: "32px",
          flexDirection: "column",
          alignItems:
            currentScreen === "confirmation" || currentScreen === "error"
              ? "center"
              : "flex-start",
          justifyContent:
            currentScreen === "confirmation" || currentScreen === "error"
              ? "space-between"
              : "flex-start",
          gap: "16px",
          borderRadius: "8px",
          border: `1px solid ${theme.palette.Neutral[400]}`,
          background: theme.palette.Neutral[100],
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {renderContent()}
    </Dialog>
  );
};

export default NeedHelpModal;
