import { useEffect, useRef, useState } from "react";
import ActivityAPIClient from "../APIClients/ActivityAPIClient";
import { Activity } from "../types/CourseTypes";

const DEBOUNCE_DELAY_MS = 1000;

export default function useActivity<ActivityType extends Activity>(
  initialActivity?: ActivityType,
) {
  const [activity, setActivity] = useState<ActivityType | undefined>(
    initialActivity,
  );
  const isUpdatingRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    clearTimeout(isUpdatingRef.current);
    isUpdatingRef.current = setTimeout(() => {
      if (activity) {
        ActivityAPIClient.updateActivity(activity);
      }
    }, DEBOUNCE_DELAY_MS);
    return () => clearTimeout(isUpdatingRef.current);
  }, [activity]);

  return { activity, setActivity };
}
