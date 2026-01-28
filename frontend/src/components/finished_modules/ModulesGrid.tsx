import React from "react";
import { Grid } from "@mui/material";
import ModuleCardLearner from "../course_viewing/library-viewing/ModuleCardLearner";
import { CourseModule } from "../../types/CourseTypes";

interface ModulesGridProps {
  modules: CourseModule[];
  unitId: string;
  getModuleCompletionDate?: (moduleId: string) => string | null;
}

const ModulesGrid: React.FC<ModulesGridProps> = ({
  modules,
  unitId,
  getModuleCompletionDate,
}) => {
  return (
    <Grid container spacing={3}>
      {modules.map((module, index) => (
        <ModuleCardLearner
          key={module.id}
          module={module}
          index={index}
          unitId={unitId}
          isSidebarOpen={false}
          completionDate={
            getModuleCompletionDate
              ? getModuleCompletionDate(module.id)
              : undefined
          }
        />
      ))}
    </Grid>
  );
};

export default ModulesGrid;
