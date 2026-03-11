import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { arrayMove } from "@dnd-kit/sortable";
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
  selectedIndex: number;
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
  rearangeUnits: () => Promise<void>;
  changeSelectedIndex: (index: number) => Promise<void>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  handleDrag: (event: any) => Promise<void>;
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

  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const rearangeUnits = async () => {
    const newUnitMap: Map<string, number> = new Map();
    /* eslint-disable  no-restricted-syntax */
    /* eslint-disable  guard-for-in */
    for (const idx in courseUnits) {
      const courseObj = courseUnits[idx];
      /* eslint-disable  radix */
      const updatedIdx = parseInt(idx, undefined) + 1;

      if (courseObj.displayIndex !== updatedIdx) {
        newUnitMap.set(courseUnits[idx].id, updatedIdx);
      }
    }
    if (newUnitMap.size > 0) {
      const data = await CourseAPIClient.rearangeUnits(newUnitMap);
      if (data) {
        const updatesUnits = courseUnits.map((unit, index) => {
          return {
            ...unit,
            displayIndex: index + 1,
          };
        });
        setCourseUnits(updatesUnits);
      }
    }
  };

  const changeSelectedIndex = async (index: number) => {
    setSelectedIndex(index);
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

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const handleDrag = async (event: any) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setCourseUnits((items) => {
        const oldIndex = items.findIndex((u) => u.id === active.id);
        const newIndex = items.findIndex((u) => u.id === over.id);
        setSelectedIndex(newIndex);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const { authenticatedUser } = useContext(AuthContext);

  useEffect(() => {
    refetchCourseUnits();
    refetchCourseProgress();
  }, [authenticatedUser]);

  const value: CourseUnitsContextType = {
    courseUnits,
    isLoading,
    error,
    selectedIndex,
    refetchCourseUnits,
    createUnit,
    editUnit,
    deleteUnit,
    rearangeUnits,
    moduleDisplayIndex,
    courseProgress,
    refetchCourseProgress,
    isModuleCompleted,
    getModuleCompletionDate,
    changeSelectedIndex,
    handleDrag,
  };

  return (
    <CourseUnitsContext.Provider value={value}>
      {children}
    </CourseUnitsContext.Provider>
  );
};
