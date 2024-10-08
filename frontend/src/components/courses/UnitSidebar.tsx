import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { CourseUnit } from "../../types/CourseTypes";
import { neutral } from "../../theme/palette";

interface UnitSideBarProps {
  courseUnits: CourseUnit[];
  handleClose: () => void;
  open: boolean;
}

export default function UnitSidebar(props: UnitSideBarProps) {
  const theme = useTheme();
  const { courseUnits, handleClose, open } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    <Drawer
      sx={{
        width: "20%",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "20%",
          boxSizing: "border-box",
        },
        display: open ? "block" : "none",
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box height="100%" sx={{ backgroundColor: theme.palette.neutral.light }}>
        <Box
          height="59px"
          display="flex"
          p="12px"
          alignItems="center"
          justifyContent="space-between"
          fontWeight="700"
          fontSize="16px"
        >
          Units
          <Button
            type="button"
            sx={{
              p: "8px",
              fontSize: "12px",
            }}
            endIcon={<ArrowBackIosIcon />}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
        <List sx={{ width: "100%" }}>
          {courseUnits.map((course, index) => {
            return (
              <React.Fragment key={course.id}>
                <ListItemButton
                  sx={{
                    py: "15px",
                    px: "32px",
                    backgroundColor:
                      selectedIndex === index ? neutral[90] : "transparent",
                  }}
                  onClick={(event) => handleListItemClick(event, index)}
                >
                  <ListItemText
                    disableTypography
                    primary={`${course.displayIndex}. ${course.title}`}
                    sx={
                      selectedIndex === index
                        ? theme.typography.titleMedium
                        : theme.typography.bodyLarge
                    }
                  />
                </ListItemButton>
                {index !== courseUnits.length - 1 && (
                  <Divider component="li" sx={{ color: "#FCF8F8" }} />
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
