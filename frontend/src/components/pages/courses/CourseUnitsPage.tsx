import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import UnitSidebar from "../../courses/UnitSidebar";
import { CourseUnit } from "../../../types/CourseTypes";
import CourseAPIClient from "../../../APIClients/CourseAPIClient";

export default function CourseUnitsPage() {
  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);

  const [open, setOpen] = useState(true);

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getCouseUnits = async () => {
      const data = await CourseAPIClient.getUnits();
      setCourseUnits(data);
    };
    getCouseUnits();
  }, []);

  return (
    <Box display="flex" width="100%" height="100%">
      <UnitSidebar
        courseUnits={courseUnits}
        handleClose={handleDrawerClose}
        open={open}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
      </Box>
    </Box>
  );
}
