import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import LearnerUnitSidebar from "../learners/HomePageSidebar";
import UserAPIClient from "../../APIClients/UserAPIClient";
import { Learner } from "../../types/UserTypes";
import FacilitatorCard from "../learners/FacilitatorCard";

const Home = (): React.ReactElement => {
  const [learner, setLearner] = useState<Learner>();

  useEffect(() => {
    UserAPIClient.getCurrentUser().then((user) => setLearner(user as Learner));
  }, []);

  if (!learner) return <p>Loading...</p>;

  return (
    <Box display="flex" width="100%">
      <LearnerUnitSidebar />

      <Box display="flex" flexGrow={1} justifyContent="center">
        <Box display="flex" flexDirection="column">
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
