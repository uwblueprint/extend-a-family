import React, { createContext, useContext, useEffect, useState } from "react";
import CourseAPIClient from "../APIClients/CourseAPIClient";
import { CourseUnit } from "../types/CourseTypes";

interface CourseUnitsContextType {
  courseUnits: CourseUnit[];
  isLoading: boolean;
  error: boolean;
  refetchCourseUnits: () => Promise<void>;
  createUnit: (title: string) => Promise<void>;
  editUnit: (unitId: string, title: string) => Promise<void>;
  deleteUnit: (unitId: string) => Promise<void>;
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

  useEffect(() => {
    refetchCourseUnits();
  }, []);

  const value: CourseUnitsContextType = {
    courseUnits,
    isLoading,
    error,
    refetchCourseUnits,
    createUnit,
    editUnit,
    deleteUnit,
  };

  return (
    <CourseUnitsContext.Provider value={value}>
      {children}
    </CourseUnitsContext.Provider>
  );
};
