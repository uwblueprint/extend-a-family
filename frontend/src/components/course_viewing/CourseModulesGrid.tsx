import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useCourseModules from "../../hooks/useCourseModules";
import { useUser } from "../../hooks/useUser";
import { CourseModule } from "../../types/CourseTypes";
import ModuleCardAdmin from "./library-viewing/ModuleCardAdmin";
import ModuleCardLearner from "./library-viewing/ModuleCardLearner";

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

  if (loading)
    return <Typography paddingLeft="10px">Loading modules...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container gap={role === "Administrator" ? "30px" : 0}>
      {courseModules.map((module: CourseModule) =>
        role === "Administrator" ? (
          <ModuleCardAdmin
            key={module.id}
            module={module}
            unitId={unitId}
            onModuleUpdate={handleModuleUpdate}
          />
        ) : (
          <ModuleCardLearner
            key={module.id}
            module={module}
            unitId={unitId}
            isSidebarOpen={isSidebarOpen}
          />
        ),
      )}
    </Grid>
  );
}
