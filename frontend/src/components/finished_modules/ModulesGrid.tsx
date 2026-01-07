import React from "react";
import { Grid } from "@mui/material";
import ModuleCardLearner from "../course_viewing/library-viewing/ModuleCardLearner";
import { CourseModule } from "../../types/CourseTypes";

interface ModulesGridProps {
  modules: CourseModule[];
  unitId: string;
}

const ModulesGrid: React.FC<ModulesGridProps> = ({ modules, unitId }) => {
  return (
    <Grid container spacing={3}>
      {modules.map((module) => (
        <ModuleCardLearner
          key={module.id}
          module={module}
          unitId={unitId}
          isSidebarOpen={false}
        />
      ))}
    </Grid>
  );
};

export default ModulesGrid;
