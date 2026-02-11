import { useCallback, useEffect, useState } from "react";
import CourseAPIClient from "../APIClients/CourseAPIClient";
import { CourseModule } from "../types/CourseTypes";

// Module-level cache so it persists across component remounts and unitId changes
const moduleDataCache: Record<string, CourseModule[]> = {};

const useCourseModules = (unitId: string) => {
  const cached = moduleDataCache[unitId];
  const [courseModules, setCourseModules] = useState<CourseModule[]>(
    cached ?? [],
  );
  const [loading, setLoading] = useState<boolean>(!cached);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseModules = useCallback(async () => {
    if (moduleDataCache[unitId]) {
      setCourseModules(moduleDataCache[unitId]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await CourseAPIClient.getModules(unitId);
      moduleDataCache[unitId] = data;
      setCourseModules(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    if (!unitId) return;
    fetchCourseModules();
  }, [fetchCourseModules, unitId]);

  return { courseModules, loading, error };
};

export default useCourseModules;
