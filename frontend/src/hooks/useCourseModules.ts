import { useCallback, useEffect, useState } from "react";
import CourseAPIClient from "../APIClients/CourseAPIClient";
import { CourseModule } from "../types/CourseTypes";

const useCourseModules = (unitId: string) => {
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [moduleDataCache, setModuleDataCache] = useState<
    Record<string, CourseModule[]>
  >({});

  const fetchCourseModules = useCallback(async () => {
    try {
      if (moduleDataCache[unitId]) {
        setCourseModules(moduleDataCache[unitId]);
        return;
      }

      setLoading(true);
      setError(null);

      const data = await CourseAPIClient.getModules(unitId);
      setCourseModules(data);
      setModuleDataCache((prevCache) => {
        const newCache = { ...prevCache };
        newCache[unitId] = data;
        return newCache;
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [unitId, moduleDataCache]);

  useEffect(() => {
    if (!unitId) return; // Prevent API call if unitId is empty

    fetchCourseModules();
  }, [fetchCourseModules, unitId]);

  return { courseModules, loading, error, moduleDataCache };
};

export default useCourseModules;
