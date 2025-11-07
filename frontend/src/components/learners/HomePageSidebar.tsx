import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CircularProgressWithLabel from "./CircularProgressBar";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import { CourseUnit } from "../../types/CourseTypes";

export default function LearnerUnitSidebar() {
  const theme = useTheme();
  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);

  useEffect(() => {
    const getCouseUnits = async () => {
      const data = await CourseAPIClient.getUnits();
      setCourseUnits(data);
    };
    getCouseUnits();
  }, []);

  return (
    <Drawer
      open
      sx={{
        maxWidth: "300px",
        width: "100%",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          position: "relative",
        },
      }}
      variant="persistent"
      anchor="left"
    >
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        sx={{
          backgroundColor: theme.palette.Learner.Light.Default,
          overflowX: "hidden",
        }}
      >
        <Box
          height="59px"
          display="flex"
          p="12px"
          paddingLeft="20px"
          alignItems="center"
          justifyContent="space-between"
          fontWeight="700"
          fontSize="16px"
        >
          Units
        </Box>
        <List sx={{ width: "100%" }}>
          {courseUnits.map((unit, index) => {
            return (
              <ListItem
                key={unit.id}
                disablePadding
                sx={{
                  borderBottom: 1,
                  borderColor:
                    index !== courseUnits.length - 1
                      ? "#DBE4E7"
                      : "transparent",
                }}
              >
                <ListItemButton
                  disableRipple
                  key={unit.id}
                  sx={{
                    py: "15px",
                    px: "32px",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.Learner.Light.Hover,
                    },
                  }}
                >
                  <ListItemText
                    disableTypography
                    primary={`${unit.displayIndex}. ${unit.title}`}
                    sx={theme.typography.bodyMedium}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box mt="auto" display="flex" justifyContent="center">
          <CircularProgressWithLabel value={75} />
        </Box>
      </Box>
    </Drawer>
  );
}
