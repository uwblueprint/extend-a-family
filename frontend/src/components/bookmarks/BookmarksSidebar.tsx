import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  useTheme,
} from "@mui/material";
import { CourseUnit } from "../../types/CourseTypes";

interface BookmarksSidebarProps {
  units: CourseUnit[];
  selectedUnitId: string | null;
  onUnitSelect: (unitId: string | null) => void;
}

const BookmarksSidebar: React.FC<BookmarksSidebarProps> = ({
  units,
  selectedUnitId,
  onUnitSelect,
}) => {
  const theme = useTheme();

  const handleAllBookmarksClick = () => onUnitSelect(null);
  const handleUnitClick = (unitId: string) => onUnitSelect(unitId);

  const getItemStyles = (isSelected: boolean) => ({
    button: {
      display: "flex",
      alignItems: "center",
      px: "32px",
      py: "15px",
      "&:hover": {
        backgroundColor: theme.palette.Learner.Light.Hover,
      },
      backgroundColor: isSelected
        ? theme.palette.Learner.Light.Selected
        : "transparent",
    },
    textShared: {
      font: theme.typography.bodyMedium,
      color: theme.palette.Neutral[700],
      fontWeight: isSelected ? 600 : 400,
    },
  });

  return (
    <Drawer
      sx={{
        width: 300,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          position: "relative",
          background: theme.palette.Learner.Light.Default,
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
      <Box width="100%">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            padding: "12px 12px 20px 20px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              color: theme.palette.Neutral[700],
              textAlign: "center",
              ...theme.typography.titleMedium,
            }}
          >
            Bookmarks by Unit
          </Box>
        </Box>

        {/* Unit List */}
        <List disablePadding>
          {/* All Bookmarks */}
          <ListItem disablePadding>
            {(() => {
              const styles = getItemStyles(selectedUnitId === null);
              return (
                <ListItemButton
                  onClick={handleAllBookmarksClick}
                  sx={styles.button}
                >
                  <Box sx={{ ...styles.textShared, mr: "20px" }}>0.</Box>
                  <ListItemText
                    disableTypography
                    primary="All Bookmarks"
                    sx={{
                      ...styles.textShared,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                </ListItemButton>
              );
            })()}
          </ListItem>

          {/* Individual Units */}
          {units.map((unit) => {
            const isSelected = selectedUnitId === unit.id;
            const styles = getItemStyles(isSelected);
            return (
              <ListItem key={unit.id} disablePadding>
                <ListItemButton
                  onClick={() => handleUnitClick(unit.id)}
                  sx={styles.button}
                >
                  <Box sx={{ ...styles.textShared, marginRight: "20px" }}>
                    {unit.displayIndex}.
                  </Box>
                  <ListItemText
                    disableTypography
                    primary={unit.title}
                    sx={{
                      ...styles.textShared,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default BookmarksSidebar;
