import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import CourseAPIClient from "../APIClients/CourseAPIClient";
import ProgressAPIClient, {
  CourseProgress,
  LearnerProgress,
  ModuleCompletion,
} from "../APIClients/ProgressAPIClient";
import { CourseUnit } from "../types/CourseTypes";
import AuthContext from "./AuthContext";

interface CourseUnitsContextType {
  courseUnits: CourseUnit[];
  isLoading: boolean;
  error: boolean;
  refetchCourseUnits: () => Promise<void>;
  createUnit: (title: string) => Promise<void>;
  editUnit: (unitId: string, title: string) => Promise<void>;
  deleteUnit: (unitId: string) => Promise<void>;
  moduleDisplayIndex: (moduleId: string) => number;
  // Progress-related fields
  courseProgress: CourseProgress | null;
  refetchCourseProgress: () => Promise<void>;
  isModuleCompleted: (moduleId: string) => boolean;
  getModuleCompletionDate: (moduleId: string) => string | null;
}

const CourseUnitsContext = createContext<CourseUnitsContextType | undefined>(
  undefined,
);

export const useCourseUnits = () => {
  const context = useContext(CourseUnitsContext);
  if (context === undefined) {
    throw new Error("useCourseUnits must be used within a CourseUnitsProvider");
  }
  return context;
};

interface CourseUnitsProviderProps {
  children: React.ReactNode;
}

export const CourseUnitsProvider: React.FC<CourseUnitsProviderProps> = ({
  children,
}) => {
  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(
    null,
  );
  const [learnerProgress, setLearnerProgress] =
    useState<LearnerProgress | null>(null);

  const refetchCourseProgress = async () => {
    try {
      const [progress, fullProgress] = await Promise.all([
        ProgressAPIClient.getCourseProgress(),
        ProgressAPIClient.getLearnerProgress(),
      ]);
      setCourseProgress(progress);
      setLearnerProgress(fullProgress);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch course progress:", err);
    }
  };

  const isModuleCompleted = useCallback(
    (moduleId: string): boolean => {
      if (!learnerProgress) return false;
      return learnerProgress.moduleCompletions.some(
        (mc: ModuleCompletion) => mc.moduleId === moduleId,
      );
    },
    [learnerProgress],
  );

  const getModuleCompletionDate = useCallback(
    (moduleId: string): string | null => {
      if (!learnerProgress) return null;
      const completion = learnerProgress.moduleCompletions.find(
        (mc: ModuleCompletion) => mc.moduleId === moduleId,
      );
      return completion ? completion.completedAt : null;
    },
    [learnerProgress],
  );

  const refetchCourseUnits = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await CourseAPIClient.getUnits();
      setCourseUnits(data);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const createUnit = async (title: string) => {
    try {
      const unit = await CourseAPIClient.createUnit(title);
      if (unit) {
        setCourseUnits((prev) => [...prev, unit]);
      }
    } catch (err) {
      setError(true);
    }
  };

  const editUnit = async (unitId: string, title: string) => {
    try {
      const editedUnit = await CourseAPIClient.editUnit(unitId, title);
      if (editedUnit) {
        setCourseUnits((prev) =>
          prev.map((unit) => (unit.id === editedUnit.id ? editedUnit : unit)),
        );
      }
    } catch (err) {
      setError(true);
    }
  };

  const deleteUnit = async (unitId: string) => {
    try {
      const deletedUnitId = await CourseAPIClient.deleteUnit(unitId);
      if (deletedUnitId) {
        setCourseUnits((prev) =>
          prev.filter((unit) => unit.id !== deletedUnitId),
        );
      }
    } catch (err) {
      setError(true);
    }
  };

  const moduleDisplayIndex = useCallback(
    (moduleId: string): number => {
      let displayIndex = -1;
      courseUnits.forEach((unit) => {
        const index = unit.modules.findIndex(
          (module) => module.id === moduleId,
        );
        if (index !== -1) {
          displayIndex = index + 1;
        }
      });
      return displayIndex;
    },
    [courseUnits],
  );

  const { authenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    refetchCourseUnits();
    refetchCourseProgress();
  }, [authenticatedUser]);

  const value: CourseUnitsContextType = {
    courseUnits,
    isLoading,
    error,
    refetchCourseUnits,
    createUnit,
    editUnit,
    deleteUnit,
    moduleDisplayIndex,
    courseProgress,
    refetchCourseProgress,
    isModuleCompleted,
    getModuleCompletionDate,
  };

  return (
    <CourseUnitsContext.Provider value={value}>
      {children}
    </CourseUnitsContext.Provider>
  );
};
