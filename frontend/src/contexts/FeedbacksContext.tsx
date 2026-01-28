import React, { createContext, useContext, useEffect, useState } from "react";
import FeedbackAPIClient from "../APIClients/FeedbackAPIClient";
import { FeedbackPopulated } from "../types/FeedbackTypes";

interface FeedbacksContextType {
  feedbacks: FeedbackPopulated[];
  isLoading: boolean;
  error: boolean;
  refetchFeedbacks: () => Promise<void>;
  exportFeedbackToTSV: () => void;
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

  const exportFeedbackToTSV = () => {
    if (feedbacks.length === 0) {
      // eslint-disable-next-line no-alert
      alert("No feedback data to export yet");
      return;
    }

    // Define TSV headers
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

    // Convert feedbacks to TSV rows
    const rows = feedbacks.map((feedback) => [
      feedback.learnerId.firstName,
      feedback.learnerId.lastName,
      feedback.moduleId.title,
      feedback.isLiked ? "Yes" : "No",
      feedback.difficulty.toString(),
      feedback.message.replace(/\t/g, " ").replace(/\n/g, " "), // Replace tabs and newlines
      feedback.createdAt,
      feedback.id,
      feedback.learnerId.id,
      feedback.moduleId.id,
    ]);

    // Combine headers and rows
    const tsvContent = [headers, ...rows]
      .map((row) => row.join("\t"))
      .join("\n");

    // Create blob and download
    const blob = new Blob([tsvContent], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `feedback_export_${
      new Date().toISOString().split("T")[0]
    }.tsv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    refetchFeedbacks();
  }, []);

  const value = {
    feedbacks,
    isLoading,
    error,
    refetchFeedbacks,
    exportFeedbackToTSV,
  };

  return (
    <FeedbacksContext.Provider value={value}>
      {children}
    </FeedbacksContext.Provider>
  );
};
