import { Box } from "@mui/material";
import LearnerUnitSidebar from "../learners/HomePageSidebar";

const Home = (): React.ReactElement => {
  return (
    <Box display="flex" width="100%">
      <LearnerUnitSidebar />
    </Box>
  );
};

export default Home;
