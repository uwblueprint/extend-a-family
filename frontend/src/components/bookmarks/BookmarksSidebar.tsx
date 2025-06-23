import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Drawer,
  useTheme,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { CourseUnit } from "../../types/CourseTypes";

interface BookmarksSidebarProps {
  units: CourseUnit[];
  selectedUnitId: string | null;
  onUnitSelect: (unitId: string | null) => void;
  open: boolean;
  onClose: () => void;
}

const BookmarksSidebar: React.FC<BookmarksSidebarProps> = ({
  units,
  selectedUnitId,
  onUnitSelect,
  open,
  onClose,
}) => {
  const theme = useTheme();

  const handleAllBookmarksClick = () => {
    onUnitSelect(null);
  };

  const handleUnitClick = (unitId: string) => {
    onUnitSelect(unitId);
  };

  return (
    <Drawer
      sx={{
        maxWidth: "301px",
        width: "100%",
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
        sx={{
          backgroundColor: theme.palette.Learner.Light,
          overflowX: "hidden",
        }}
      >
        {/* Header */}
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
          Bookmarks
          <Button
            type="button"
            sx={{
              p: "8px",
              fontSize: "12px",
              color: theme.palette.Neutral[700],
              lineHeight: "1.5",
            }}
            endIcon={<MenuOpenIcon />}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>

        {/* Navigation List */}
        <List sx={{ width: "100%" }}>
          {/* All Bookmarks Item */}
          <ListItem
            disablePadding
            sx={{
              borderBottom: 1,
              borderColor: units.length > 0 ? "#DBE4E7" : "transparent",
            }}
          >
            <ListItemButton
              onClick={handleAllBookmarksClick}
              selected={selectedUnitId === null}
              sx={{
                py: "15px",
                px: "32px",
                backgroundColor:
                  selectedUnitId === null
                    ? theme.palette.Learner.Hover
                    : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.Learner.Hover,
                },
              }}
            >
              <BookmarkIcon sx={{ marginRight: "12px", fontSize: "20px" }} />
              <ListItemText
                disableTypography
                primary="All Bookmarks"
                sx={
                  selectedUnitId === null
                    ? theme.typography.titleMedium
                    : theme.typography.bodyLarge
                }
              />
            </ListItemButton>
          </ListItem>

          {/* Unit Items */}
          {units.map((unit, index) => (
            <ListItem
              key={unit.id}
              disablePadding
              sx={{
                borderBottom: 1,
                borderColor:
                  index !== units.length - 1 ? "#DBE4E7" : "transparent",
              }}
            >
              <ListItemButton
                onClick={() => handleUnitClick(unit.id)}
                selected={selectedUnitId === unit.id}
                sx={{
                  py: "15px",
                  px: "32px",
                  backgroundColor:
                    selectedUnitId === unit.id
                      ? theme.palette.Learner.Hover
                      : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.Learner.Hover,
                  },
                }}
              >
                <ListItemText
                  disableTypography
                  primary={`${unit.displayIndex}. ${unit.title}`}
                  sx={
                    selectedUnitId === unit.id
                      ? theme.typography.titleMedium
                      : theme.typography.bodyLarge
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default BookmarksSidebar;
