import * as React from "react";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Drawer, Stack, Typography, useTheme } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import { CourseUnit } from "../../types/CourseTypes";

const FeedbackAdminUnitSidebarItem = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) => {
  const theme = useTheme();

  return (
    <>
      <ListItemButton
        onClick={onClick}
        sx={{
          borderTop: `1px solid ${theme.palette.Neutral[300]}`,
          borderBottom: `1px solid ${theme.palette.Neutral[300]}`,
          paddingLeft: "32px",
        }}
      >
        <ListItemText>
          <Typography variant={open ? "labelLargeProminent" : "bodyMedium"}>
            Unit 1: Money Basics
          </Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: "48px" }}>
            <Stack
              direction="row"
              gap="8px"
              alignItems="center"
              alignSelf="stretch"
            >
              <Typography variant="bodyMedium">1.</Typography>
              <Typography variant="bodyMedium">
                Introduction to Needs and Wants
              </Typography>
            </Stack>
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
};

const FeedbackAdminUnitSidebar = () => {
  const theme = useTheme();

  const [courseUnits, setCourseUnits] = React.useState<Array<CourseUnit>>([]);

  const didFetchUnitsRef = React.useRef(false);
  React.useEffect(() => {
    if (didFetchUnitsRef.current) return;
    didFetchUnitsRef.current = true;

    const getCourseUnits = async () => {
      const data = await CourseAPIClient.getUnits();
      setCourseUnits(data);
    };

    getCourseUnits();
  }, []);

  const [open, setOpen] = React.useState<string | undefined>(undefined); // unitId of open unit

  return (
    <Drawer
      sx={{
        width: 388,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          position: "relative",
          background: theme.palette.Administrator.Light.Default,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
        },
      }}
      variant="persistent"
      anchor="left"
      open
    >
      <List
        sx={{ width: "100%" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <Box
            sx={{ display: "flex", padding: "20px 12px 20px 20px" }}
            alignItems="center"
            alignSelf="stretch"
          >
            <Typography variant="titleMedium">Unit Feedback</Typography>
          </Box>
        }
      >
        {courseUnits.map((unit) => (
          <FeedbackAdminUnitSidebarItem
            key={unit.id}
            open={open === unit.id}
            onClick={() =>
              setOpen((prevOpen) =>
                prevOpen === unit.id ? undefined : unit.id,
              )
            }
          />
        ))}
      </List>
    </Drawer>
  );
};

const FeedbackAdminView = () => {
  return (
    <Box
      display="flex"
      width="100%"
      minHeight="100vh"
      height="100vh"
      overflow="hidden"
    >
      <FeedbackAdminUnitSidebar />
    </Box>
  );
};

export default FeedbackAdminView;
