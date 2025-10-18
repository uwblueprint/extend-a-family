import { useEffect, useRef, useState } from "react";
import ActivityAPIClient from "../APIClients/ActivityAPIClient";
import { Activity } from "../types/CourseTypes";

export default function useActivity<ActivityType extends Activity>(
  initialActivity: ActivityType,
) {
  const [activity, setActivity] = useState<ActivityType>(initialActivity);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (loading) return;

    setLoading(true);
    ActivityAPIClient.updateActivity<ActivityType>(activity).then(
      (updatedActivity) => {
        if (updatedActivity) {
          setError(null);
        } else {
          setError("Failed to update activity");
        }
        setLoading(false);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity]);

  return { activity, setActivity, loading, error };
}
