import { Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import useCourseModules from "../../hooks/useCourseModules";
import { useUser } from "../../hooks/useUser";
import { CourseModule } from "../../types/CourseTypes";
import ModuleCardAdmin from "./library-viewing/ModuleCardAdmin";
import ModuleCardLearner from "./library-viewing/ModuleCardLearner";
import ModuleCardFacilitator from "./library-viewing/ModuleCardFacilitator";

interface ModuleGridProps {
  unitId: string;
  isSidebarOpen: boolean;
}

export default function CourseModulesGrid({
  unitId,
  isSidebarOpen,
}: ModuleGridProps) {
  const {
    courseModules: initialModules,
    loading,
    error,
  } = useCourseModules(unitId);
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const { role } = useUser();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCourseModules(initialModules);
  }, [initialModules]);

  const handleModuleUpdate = (updatedModule: CourseModule) => {
    setCourseModules((prev) =>
      prev.map((module) =>
        module.id === updatedModule.id ? updatedModule : module,
      ),
    );
  };

  const saveModuleOrder = useCallback(
    async (modules: CourseModule[]) => {
      const moduleIds = modules.map((module) => module.id);

      try {
        await CourseAPIClient.reorderModules(unitId, moduleIds);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to save module order:", err);
      }
    },
    [unitId],
  );

  const moveModule = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setCourseModules((prevModules) => {
        const dragModule = prevModules[dragIndex];
        const newModules = [...prevModules];
        newModules.splice(dragIndex, 1);
        newModules.splice(hoverIndex, 0, dragModule);

        // Debounce the save operation
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
          saveModuleOrder(newModules);
        }, 1000);

        return newModules;
      });
    },
    [saveModuleOrder],
  );

  if (loading)
    return <Typography paddingLeft="10px">Loading modules...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const content = (
    <Grid container gap={role === "Learner" ? 0 : "30px"}>
      {courseModules.map((module: CourseModule, index: number) => {
        switch (role) {
          case "Administrator":
            return (
              <ModuleCardAdmin
                key={module.id}
                module={module}
                unitId={unitId}
                index={index}
                onModuleUpdate={handleModuleUpdate}
                moveModule={moveModule}
              />
            );
          case "Facilitator":
            return (
              <ModuleCardFacilitator
                key={module.id}
                module={module}
                index={index}
              />
            );
          case "Learner":
          default:
            return (
              <ModuleCardLearner
                key={module.id}
                module={module}
                index={index}
                unitId={unitId}
                isSidebarOpen={isSidebarOpen}
              />
            );
        }
      })}
    </Grid>
  );

  return role === "Administrator" ? (
    <DndProvider backend={HTML5Backend}>{content}</DndProvider>
  ) : (
    content
  );
}
