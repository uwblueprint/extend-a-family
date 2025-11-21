import { Box } from "@mui/material";
import LearnerUnitSidebar from "../learners/HomePageSidebar";
import FacilitatorCard from "../learners/FacilitatorCard";

const Home = (): React.ReactElement => {
  return (
    <Box display="flex" width="100%">
      <LearnerUnitSidebar />
      <FacilitatorCard />
    </Box>
  );
};

export default Home;
