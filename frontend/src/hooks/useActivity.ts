import { useCallback, useEffect, useState } from "react";
import ActivityAPIClient from "../APIClients/ActivityAPIClient";
import { Activity } from "../types/CourseTypes";

const DEBOUNCE_DELAY_MS = 3000;

export default function useActivity<ActivityType extends Activity>(
  initialActivity?: ActivityType,
) {
  const [activity, setActivity] = useState<ActivityType | undefined>(
    initialActivity,
  );

  const sendActivityUpdate = useCallback(async () => {
    if (activity) {
      ActivityAPIClient.updateActivity(activity);
    }
  }, [activity]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      sendActivityUpdate();
    }, DEBOUNCE_DELAY_MS);
    return () => clearInterval(updateInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { activity, setActivity };
}
