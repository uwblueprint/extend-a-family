import { useCallback, useEffect, useRef, useState } from "react";
import ActivityAPIClient from "../APIClients/ActivityAPIClient";
import { Activity } from "../types/CourseTypes";

export default function useActivity<ActivityType extends Activity>(
  initialActivity?: ActivityType,
) {
  const [activity, setActivity] = useState<ActivityType | undefined>(
    initialActivity,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Use refs to track state that doesn't need to trigger re-renders
  const isUpdatingRef = useRef<boolean>(false);
  const pendingUpdateRef = useRef<ActivityType | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce delay in milliseconds
  const DEBOUNCE_DELAY = 500;

  const processUpdate = useCallback(async (activityToUpdate: ActivityType) => {
    // If already updating, store the latest activity for later processing
    if (isUpdatingRef.current) {
      pendingUpdateRef.current = activityToUpdate;
      return;
    }

    isUpdatingRef.current = true;
    setLoading(true);
    setError(null);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const updatedActivity =
        await ActivityAPIClient.updateActivity<ActivityType>(
          activityToUpdate,
          abortController.signal,
        );

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      if (updatedActivity) {
        setError(null);
      } else {
        setError("Failed to update activity");
      }
    } catch (err) {
      // Only set error if request wasn't aborted
      if (!abortController.signal.aborted) {
        setError("Failed to update activity");
      }
    } finally {
      // Only update loading state if this request wasn't aborted
      if (!abortController.signal.aborted) {
        isUpdatingRef.current = false;
        setLoading(false);

        // Process any pending update
        if (pendingUpdateRef.current) {
          const pendingActivity = pendingUpdateRef.current;
          pendingUpdateRef.current = null;
          // Use setTimeout to avoid recursive calls
          setTimeout(() => processUpdate(pendingActivity), 0);
        }
      }
    }
  }, []);

  // Debounced update function
  const debouncedUpdate = useCallback(
    (activityToUpdate: ActivityType) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        processUpdate(activityToUpdate);
      }, DEBOUNCE_DELAY);
    },
    [processUpdate],
  );

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (activity) debouncedUpdate(activity);
  }, [activity, debouncedUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { activity, setActivity, loading, error };
}
