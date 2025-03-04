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
import { useUser } from "../../hooks/useUser";

interface UnitSideBarProps {
  courseUnits: CourseUnit[];
  handleClose: () => void;
  open: boolean;
  onSelectUnit: (unit: CourseUnit) => void;
}

export default function UnitSidebar(props: UnitSideBarProps) {
  const theme = useTheme();
  const user = useUser();
  const { courseUnits, handleClose, open, onSelectUnit } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    onSelectUnit(courseUnits[index]);
  };

  return (
    <Drawer
      sx={{
        width: "20%",
        height: "100%",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          position: "relative",
        },
        display: open ? "block" : "none",
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box
        height="100%"
        sx={{ backgroundColor: theme.palette[user.role].Light }}
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
          <Button
            type="button"
            sx={{
              p: "8px",
              fontSize: "12px",
              color: theme.palette.Neutral[700],
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
                      selectedIndex === index
                        ? theme.palette[user.role].Hover
                        : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette[user.role].Hover,
                    },
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
