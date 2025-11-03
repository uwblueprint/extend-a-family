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
        ? "var(--Learner-Light-Selected, #ADEDF7)"
        : "transparent",
    },
    index: {
      fontFamily: "Lexend Deca",
      fontSize: "16px",
      fontWeight: 400,
      color: "var(--Neutral-700, #555759)",
      mr: "20px",
    },
    text: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontFamily: "Lexend Deca",
      fontStyle: "normal",
      lineHeight: "140%",
      letterSpacing: "0.2px",
      ...(isSelected
        ? {
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--Neutral-900, #1A1C1E)",
          }
        : {
            fontSize: "16px",
            fontWeight: 400,
            color: "var(--Neutral-700, #555759)",
          }),
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
          background: "var(--Learner-Light-Default, #E3F9FC)",
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
            padding: "12px 12px 12px 20px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              color: "var(--Neutral-700, #555759)",
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
                  <Box sx={styles.index}>0.</Box>
                  <ListItemText
                    disableTypography
                    primary="All Bookmarks"
                    sx={styles.text}
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
                  <Box sx={styles.index}>{unit.displayIndex}.</Box>
                  <ListItemText
                    disableTypography
                    primary={unit.title}
                    sx={styles.text}
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
