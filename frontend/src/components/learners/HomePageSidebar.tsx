import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import CircularProgressWithLabel from "./CircularProgressBar";
import { useCourseUnits } from "../../contexts/CourseUnitsContext";

export default function LearnerUnitSidebar() {
  const theme = useTheme();
  const { courseUnits, courseProgress } = useCourseUnits();

  // Calculate overall progress percentage
  const progressValue = courseProgress?.progressPercentage ?? 0;

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
                component={Link}
                to={`/course?selectedUnit=${unit.id}`}
                key={unit.id}
                disablePadding
                sx={{
                  borderBottom: 1,
                  borderColor:
                    index !== courseUnits.length - 1
                      ? "#DBE4E7"
                      : "transparent",
                  color: "inherit",
                  textDecoration: "none",
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
        <Box
          position="fixed"
          width="300px"
          bottom="0px"
          display="flex"
          justifyContent="center"
        >
          <CircularProgressWithLabel value={progressValue} />
        </Box>
      </Box>
    </Drawer>
  );
}
