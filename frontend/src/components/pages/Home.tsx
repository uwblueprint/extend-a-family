import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import ProgressAPIClient from "../../APIClients/ProgressAPIClient";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { BOOKMARKS_PAGE, FINISHED_MODULES_PAGE } from "../../constants/Routes";
import { CourseModule, ModuleStatus } from "../../types/CourseTypes";
import { Learner } from "../../types/UserTypes";
import CourseCard from "../learners/CourseCard";
import FacilitatorCard from "../learners/FacilitatorCard";
import LearnerUnitSidebar from "../learners/HomePageSidebar";
import NavButton from "../learners/NavButton";

interface RankedModule {
  module: CourseModule;
  unitId: string;
  unitDisplayIndex: number;
  progress: number;
}

const Home = (): React.ReactElement => {
  const [learner, setLearner] = useState<Learner>();
  const [rankedModules, setRankedModules] = useState<RankedModule[]>([]);
  const theme = useTheme();

  useEffect(() => {
    UserAPIClient.getCurrentUser().then((user) => setLearner(user as Learner));
  }, []);

  useEffect(() => {
    const fetchModulesWithProgress = async () => {
      const units = await CourseAPIClient.getUnits();

      // Collect all published modules with their unit context
      const allModules: Omit<RankedModule, "progress">[] = [];
      units.forEach((unit) => {
        unit.modules
          .filter((m) => m.status === ModuleStatus.published)
          .forEach((mod) => {
            allModules.push({
              module: mod,
              unitId: unit.id,
              unitDisplayIndex: unit.displayIndex,
            });
          });
      });

      // Fetch progress for each module in parallel
      const progressResults = await Promise.all(
        allModules.map((entry) =>
          ProgressAPIClient.getModuleProgress(entry.module.id),
        ),
      );

      // Combine modules with their computed progress percentage
      const modulesWithProgress: RankedModule[] = allModules.map((entry, i) => {
        const prog = progressResults[i];
        let percentage = 0;
        if (prog && prog.totalActivities > 0) {
          percentage = Math.round(
            (prog.completedActivities / prog.totalActivities) * 100,
          );
        } else if (prog) {
          percentage = 100;
        }
        return { ...entry, progress: percentage };
      });

      // Sort helper: by unit displayIndex, then module displayIndex
      const sortByPosition = (a: RankedModule, b: RankedModule) => {
        if (a.unitDisplayIndex !== b.unitDisplayIndex)
          return a.unitDisplayIndex - b.unitDisplayIndex;
        return a.module.displayIndex - b.module.displayIndex;
      };

      // Rank: 1) partially complete, 2) unstarted, 3) completed
      const partial = modulesWithProgress
        .filter((m) => m.progress > 0 && m.progress < 100)
        .sort(sortByPosition);
      const unstarted = modulesWithProgress
        .filter((m) => m.progress === 0)
        .sort(sortByPosition);
      const completed = modulesWithProgress
        .filter((m) => m.progress === 100)
        .sort(sortByPosition);

      setRankedModules([...partial, ...unstarted, ...completed].slice(0, 4));
    };

    fetchModulesWithProgress();
  }, []);

  if (!learner)
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

  const topModule = rankedModules.length > 0 ? rankedModules[0] : undefined;
  const otherModules = rankedModules.slice(1);

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
          <Typography variant="displayLarge" marginBottom="25px">
            {topModule
              ? `Continue with Unit ${topModule.unitDisplayIndex} Module ${topModule.module.displayIndex}`
              : "Welcome!"}
          </Typography>
          {topModule ? (
            <CourseCard
              size="large"
              module={topModule.module}
              unitId={topModule.unitId}
              progress={topModule.progress}
            />
          ) : (
            <CourseCard size="large" />
          )}
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
            {otherModules.map((entry) => (
              <CourseCard
                key={entry.module.id}
                module={entry.module}
                unitId={entry.unitId}
                progress={entry.progress}
              />
            ))}
          </Box>

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
