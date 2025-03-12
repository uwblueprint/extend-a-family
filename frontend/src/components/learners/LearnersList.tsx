import React from "react";
import { Typography } from "@mui/material";
import {
  isAuthenticatedFacilitator,
  isAuthenticatedLearner,
} from "../../types/AuthTypes";
import { useUser } from "../../hooks/useUser";

const LearnerList = (): React.ReactElement => {
  const user = useUser();

  return (
    <>
      {isAuthenticatedFacilitator(user) && (
        <Typography variant="body1">Learners: {user.learners}</Typography>
      )}
      {isAuthenticatedLearner(user) && (
        <Typography variant="body1">Facilitator: {user.facilitator}</Typography>
      )}
    </>
  );
};

export default LearnerList;
