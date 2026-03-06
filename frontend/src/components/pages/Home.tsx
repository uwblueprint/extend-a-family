import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useMemo, useState } from "react";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { BOOKMARKS_PAGE, FINISHED_MODULES_PAGE } from "../../constants/Routes";
import { useCourseUnits } from "../../contexts/CourseUnitsContext";
import { CourseModule } from "../../types/CourseTypes";
import { Learner } from "../../types/UserTypes";
import CourseCard from "../learners/CourseCard";
import FacilitatorCard from "../learners/FacilitatorCard";
import LearnerUnitSidebar from "../learners/HomePageSidebar";
import NavButton from "../learners/NavButton";

interface ModuleWithProgress extends CourseModule {
  progress?: {
    totalActivities: number;
    completedActivities: number;
    progressPercentage: number;
    isCompleted: boolean;
    completedAt?: string;
  };
}

interface RankedModule {
  module: ModuleWithProgress;
  unitId: string;
  unitDisplayIndex: number;
  progressPercentage: number;
}

const Home = (): React.ReactElement => {
  const [learner, setLearner] = useState<Learner>();
  const theme = useTheme();
  const { courseUnits, isLoading: unitsLoading } = useCourseUnits();
  const [unitModules, setUnitModules] = useState<
    {
      unitId: string;
      unitDisplayIndex: number;
      modules: ModuleWithProgress[];
    }[]
  >([]);
  const [modulesLoading, setModulesLoading] = useState(true);

  useEffect(() => {
    UserAPIClient.getCurrentUser().then((user) => setLearner(user as Learner));
  }, []);

  // Fetch full module objects (with progress) for each unit
  useEffect(() => {
    if (unitsLoading || courseUnits.length === 0) {
      setModulesLoading(false);
      return;
    }

    const fetchModules = async () => {
      setModulesLoading(true);
      const results = await Promise.all(
        courseUnits.map(async (unit) => {
          const modules = (await CourseAPIClient.getModules(
            unit.id,
          )) as ModuleWithProgress[];
          return {
            unitId: unit.id,
            unitDisplayIndex: unit.displayIndex,
            modules,
          };
        }),
      );
      setUnitModules(results);
      setModulesLoading(false);
    };

    fetchModules();
  }, [courseUnits, unitsLoading]);

  // Rank modules: partially complete first, then unstarted, then completed
  // Within each group, sort by unit displayIndex then module displayIndex
  const rankedModules: RankedModule[] = useMemo(() => {
    const allModules: RankedModule[] = [];
    unitModules.forEach(({ unitId, unitDisplayIndex, modules }) => {
      modules.forEach((mod) => {
        const pct = mod.progress?.progressPercentage ?? 0;
        allModules.push({
          module: mod,
          unitId,
          unitDisplayIndex,
          progressPercentage: pct,
        });
      });
    });

    const partiallyComplete = allModules.filter(
      (m) => m.progressPercentage > 0 && m.progressPercentage < 100,
    );
    const unstarted = allModules.filter((m) => m.progressPercentage === 0);
    const completed = allModules.filter((m) => m.progressPercentage === 100);

    const sortByIndex = (a: RankedModule, b: RankedModule) =>
      a.unitDisplayIndex - b.unitDisplayIndex ||
      a.module.displayIndex - b.module.displayIndex;

    partiallyComplete.sort(sortByIndex);
    unstarted.sort(sortByIndex);
    completed.sort(sortByIndex);

    return [...partiallyComplete, ...unstarted, ...completed].slice(0, 4);
  }, [unitModules]);

  if (!learner || unitsLoading || modulesLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress sx={{ color: theme.palette.Learner.Dark.Default }} />
      </Box>
    );

  const topModule = rankedModules[0];
  const remainingModules = rankedModules.slice(1);

  return (
    <Box
      display="flex"
      width="100%"
      minHeight="100vh"
      height="100vh"
      overflow="hidden"
    >
      <LearnerUnitSidebar />

      <Box sx={{ flexGrow: 1, p: "48px", mb: "48px", overflowY: "scroll" }}>
        <Box display="flex" flexDirection="column">
          <Typography variant="bodyLarge">
            Hello, {learner.firstName}!
          </Typography>

          {topModule && (
            <>
              <Typography variant="displayLarge" marginBottom="25px">
                Continue with Unit {topModule.unitDisplayIndex} Module{" "}
                {topModule.module.displayIndex}
              </Typography>
              <CourseCard
                module={topModule.module}
                unitId={topModule.unitId}
                size="large"
                progress={topModule.progressPercentage}
              />
            </>
          )}

          {remainingModules.length > 0 && (
            <>
              <Typography
                variant="displaySmall"
                marginTop="70px"
                marginBottom="35px"
              >
                Or get started with these modules
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                {remainingModules.map((ranked) => (
                  <CourseCard
                    key={ranked.module.id}
                    module={ranked.module}
                    unitId={ranked.unitId}
                    progress={ranked.progressPercentage}
                  />
                ))}
              </Box>
            </>
          )}

          <Stack
            direction="row"
            width="100%"
            gap="20px"
            flexWrap="wrap"
            marginTop="70px"
            marginBottom="70px"
          >
            <NavButton
              label="Bookmarks"
              icon={<BookmarkBorderIcon />}
              href={BOOKMARKS_PAGE}
            />
            <NavButton
              label="Finished Modules"
              icon={<CheckCircleOutlineIcon />}
              href={FINISHED_MODULES_PAGE}
            />
          </Stack>
          <Box width="100%" mb="30px">
            <Typography variant="displaySmall" textAlign="left">
              Your Facilitator
            </Typography>
          </Box>
          <FacilitatorCard facilitator={learner!.facilitator} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
