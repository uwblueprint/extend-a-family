import { Button, Grid, Typography, useTheme } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Add } from "@mui/icons-material";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import useCourseModules from "../../hooks/useCourseModules";
import { useUser } from "../../hooks/useUser";
import { CourseModule, ModuleStatus } from "../../types/CourseTypes";
import ModuleCardAdmin from "./library-viewing/ModuleCardAdmin";
import ModuleCardLearner from "./library-viewing/ModuleCardLearner";
import ModuleCardFacilitator from "./library-viewing/ModuleCardFacilitator";
import CreateModuleModal from "./modals/CreateModuleModal";

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
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { role } = useUser();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();

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

  const handleModuleDelete = (deletedModuleId: string) => {
    setCourseModules((prev) =>
      prev.filter((module) => module.id !== deletedModuleId),
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
    <>
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
                  onModuleDelete={handleModuleDelete}
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
                module.status === ModuleStatus.published && (
                  <ModuleCardLearner
                    key={module.id}
                    module={module}
                    index={index}
                    unitId={unitId}
                    isSidebarOpen={isSidebarOpen}
                  />
                )
              );
          }
        })}
      </Grid>
      {role === "Administrator" && (
        <Button
          type="button"
          sx={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            display: "flex",
            padding: "16px 20px 16px 16px",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            borderRadius: "16px",
            background: theme.palette.Administrator.Light.Selected,
            boxShadow:
              "0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.30)",
          }}
          onClick={() => setUploadModalOpen(true)}
        >
          <Add
            sx={{
              fontSize: "24px",
              color: theme.palette.Administrator.Dark.Default,
            }}
          />
          <Typography
            variant="labelLarge"
            color={theme.palette.Administrator.Dark.Default}
            display="inline"
          >
            Create Module
          </Typography>
        </Button>
      )}
      <CreateModuleModal
        open={uploadModalOpen}
        setUploadModalOpen={setUploadModalOpen}
        unitId={unitId}
        onCreate={(newModule) => {
          setCourseModules((prev) => [...prev, newModule]);
        }}
      />
    </>
  );

  return role === "Administrator" ? (
    <DndProvider backend={HTML5Backend}>{content}</DndProvider>
  ) : (
    content
  );
}
