import React, { createContext, useContext, useEffect, useState } from "react";
import FeedbackAPIClient from "../APIClients/FeedbackAPIClient";
import { FeedbackPopulated } from "../types/FeedbackTypes";
import AuthContext from "./AuthContext";

interface FeedbacksContextType {
  feedbacks: FeedbackPopulated[];
  isLoading: boolean;
  error: boolean;
  refetchFeedbacks: () => Promise<void>;
  exportFeedbackToCSV: () => void;
}

const FeedbacksContext = createContext<FeedbacksContextType | undefined>(
  undefined,
);

export const useFeedbacks = () => {
  const context = useContext(FeedbacksContext);
  if (context === undefined) {
    throw new Error("useFeedbacks must be used within a FeedbacksProvider");
  }
  return context;
};

interface FeedbacksProviderProps {
  children: React.ReactNode;
}

export const FeedbacksProvider: React.FC<FeedbacksProviderProps> = ({
  children,
}) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackPopulated[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const refetchFeedbacks = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await FeedbackAPIClient.fetchAllFeedback();
      setFeedbacks(data);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const exportFeedbackToCSV = () => {
    if (feedbacks.length === 0) {
      // eslint-disable-next-line no-alert
      alert("No feedback data to export yet");
      return;
    }

    // Define CSV headers
    const headers = [
      "Learner First Name",
      "Learner Last Name",
      "Module Title",
      "Is Liked",
      "Difficulty",
      "Message",
      "Created At",
      "Feedback ID",
      "Learner ID",
      "Module ID",
    ];

    // Convert feedbacks to CSV rows
    const rows = feedbacks.map((feedback) => [
      feedback.learnerId.firstName,
      feedback.learnerId.lastName,
      feedback.moduleId.title,
      feedback.isLiked ? "Yes" : "No",
      feedback.difficulty.toString(),
      `"${feedback.message.replace(/"/g, '""')}"`, // Quote message to handle commas and escape quotes
      feedback.createdAt,
      feedback.id,
      feedback.learnerId.id,
      feedback.moduleId.id,
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `feedback_export_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const { authenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    refetchFeedbacks();
  }, [authenticatedUser]);

  const value = {
    feedbacks,
    isLoading,
    error,
    refetchFeedbacks,
    exportFeedbackToCSV,
  };

  return (
    <FeedbacksContext.Provider value={value}>
      {children}
    </FeedbacksContext.Provider>
  );
};
