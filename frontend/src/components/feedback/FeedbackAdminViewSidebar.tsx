import * as React from "react";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Drawer, Stack, Typography, useTheme } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { CourseUnit } from "../../types/CourseTypes";

const FeedbackAdminUnitSidebarItem = ({
  open,
  onClick,
  unit,
  selectedModuleId,
  setSelectedModuleId,
}: {
  open: boolean;
  onClick: () => void;
  unit: CourseUnit;
  selectedModuleId: string | null;
  setSelectedModuleId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const theme = useTheme();
  const unitView = open && selectedModuleId === null;
  return (
    <>
      <ListItemButton
        onClick={onClick}
        sx={{
          borderTop: `1px solid ${theme.palette.Neutral[300]}`,
          borderBottom: `1px solid ${theme.palette.Neutral[300]}`,
          paddingLeft: "32px",
          ...(unitView && {
            backgroundColor: theme.palette.Administrator.Light.Selected,
          }),
        }}
      >
        <ListItemText>
          <Typography variant={unitView ? "labelLargeProminent" : "bodyMedium"}>
            {unit.title}
          </Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {unit.modules.map((module) => (
            <ListItemButton
              key={module.id}
              sx={{
                pl: "48px",
                ...(selectedModuleId === module.id && {
                  backgroundColor: theme.palette.Administrator.Light.Selected,
                }),
              }}
              onClick={() => setSelectedModuleId(module.id)}
            >
              <Stack
                direction="row"
                gap="8px"
                alignItems="center"
                alignSelf="stretch"
              >
                <Typography variant="bodyMedium">
                  {module.displayIndex}.
                </Typography>
                <Typography variant="bodyMedium">{module.title}</Typography>
              </Stack>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

const FeedbackAdminUnitSidebar = ({
  courseUnits,
  selectedUnitId,
  setSelectedUnitId,
  selectedModuleId,
  setSelectedModuleId,
}: {
  courseUnits: Array<CourseUnit>;
  selectedUnitId: string | null;
  setSelectedUnitId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedModuleId: string | null;
  setSelectedModuleId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const theme = useTheme();

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
            unit={unit}
            open={selectedUnitId === unit.id}
            onClick={() => {
              setSelectedUnitId((prevSelectedUnitId) =>
                prevSelectedUnitId === unit.id && selectedModuleId === null
                  ? null
                  : unit.id,
              );
              setSelectedModuleId(null);
            }}
            selectedModuleId={selectedModuleId}
            setSelectedModuleId={setSelectedModuleId}
          />
        ))}
      </List>
    </Drawer>
  );
};

export default FeedbackAdminUnitSidebar;
