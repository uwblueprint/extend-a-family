import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
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
          paddingLeft="20px"
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
              color: theme.palette.neutral.main,
              lineHeight: "1.5",
            }}
            endIcon={<MenuOpenIcon />}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
        <List sx={{ width: "100%" }}>
          {courseUnits.map((course, index) => {
            return (
              <ListItem
                key={course.id}
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
                  key={course.id}
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
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
