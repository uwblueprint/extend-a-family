import { useEffect, useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LearnerUnitSidebar from "../learners/HomePageSidebar";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { Learner } from "../../types/UserTypes";
import CourseCard from "../learners/courseCard";
import FacilitatorCard from "../learners/FacilitatorCard";
import NavButton from "../learners/NavButton";
import { BOOKMARKS_PAGE } from "../../constants/Routes";

const Home = (): React.ReactElement => {
  const [learner, setLearner] = useState<Learner>();
  const theme = useTheme();

  useEffect(() => {
    UserAPIClient.getCurrentUser().then((user) => setLearner(user as Learner));
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

  return (
    <Box display="flex" width="100%">
      <LearnerUnitSidebar />

      <Box display="flex" flexGrow={1} justifyContent="center" margin={4}>
        <Box display="flex" flexDirection="column">
          <Typography variant="bodyLarge">
            Hello, {learner.firstName}!
          </Typography>
          <Typography variant="displayLarge" marginBottom="25px">
            Continue with Unit 1 Module 5
          </Typography>
          <CourseCard size="large" />
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
              justifyContent: "space-between",
            }}
          >
            <CourseCard />
            <CourseCard />
            <CourseCard />
          </Box>
          <Stack
            direction="row"
            width="100%"
            justifyContent="space-between"
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
