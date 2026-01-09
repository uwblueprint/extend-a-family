import React, { createContext, useContext, useEffect, useState } from "react";
import FeedbackAPIClient from "../APIClients/FeedbackAPIClient";
import { FeedbackPopulated } from "../types/FeedbackTypes";

interface FeedbacksContextType {
  feedbacks: FeedbackPopulated[];
  isLoading: boolean;
  error: boolean;
  refetchFeedbacks: () => Promise<void>;
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

  useEffect(() => {
    refetchFeedbacks();
  }, []);

  const value = {
    feedbacks,
    isLoading,
    error,
    refetchFeedbacks,
  };

  return (
    <FeedbacksContext.Provider value={value}>
      {children}
    </FeedbacksContext.Provider>
  );
};
