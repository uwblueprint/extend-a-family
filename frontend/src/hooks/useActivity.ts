import { useCallback, useEffect, useRef, useState } from "react";
import ActivityAPIClient from "../APIClients/ActivityAPIClient";
import { Activity } from "../types/CourseTypes";
import { useUser } from "./useUser";

const DEBOUNCE_DELAY_MS = 2000;

export default function useActivity<ActivityType extends Activity>(
  initialActivity?: ActivityType,
) {
  const [activity, setActivity] = useState<ActivityType | undefined>(
    initialActivity,
  );
  const { role } = useUser();

  const activityRef = useRef<ActivityType | undefined>(initialActivity);
  const lastSentActivityRef = useRef<ActivityType | undefined>(initialActivity);
  const hasUnsavedChanges = useRef(false);

  useEffect(() => {
    activityRef.current = activity;
    if (activity !== lastSentActivityRef.current) {
      hasUnsavedChanges.current = true;
    }
  }, [activity]);

  const sendActivityUpdate = useCallback(() => {
    if (
      role !== "Administrator" ||
      !hasUnsavedChanges.current ||
      !activityRef.current
    ) {
      return;
    }

    ActivityAPIClient.updateActivity(activityRef.current);
    lastSentActivityRef.current = activityRef.current;
    hasUnsavedChanges.current = false;
  }, [role]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      sendActivityUpdate();
    }, DEBOUNCE_DELAY_MS);
    return () => clearInterval(updateInterval);
  }, [sendActivityUpdate]);

  return { activity, setActivity };
}
