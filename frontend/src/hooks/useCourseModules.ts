import { useEffect, useState } from "react";
import CourseAPIClient from "../APIClients/CourseAPIClient";
import { CourseModule } from "../types/CourseTypes";

const useCourseModules = (unitId: string) => {
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unitId) return; // Prevent API call if unitId is empty

    const fetchCourseModules = async () => {
      try {
        console.log("hi");

        setLoading(true);
        setError(null);

        const data = await CourseAPIClient.getModules(unitId);

        console.log(data);
        // const data: CourseModuleDTO[] = await response.json();
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
    };

    fetchCourseModules();
  }, [unitId]);

  return { courseModules, loading, error };
};

export default useCourseModules;
