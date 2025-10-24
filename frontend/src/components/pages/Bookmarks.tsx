import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import UserAPIClient from "../../APIClients/UserAPIClient";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import { Bookmark } from "../../types/UserTypes";
import { CourseUnit, CourseModule } from "../../types/CourseTypes";
import useBookmarksFilter from "../../hooks/useBookmarksFilter";
import { BookmarksSidebar, BookmarksContent, ExpandCollapseButton } from "../bookmarks";

const Bookmarks = (): React.ReactElement => {
  const theme = useTheme();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [units, setUnits] = useState<CourseUnit[]>([]);
  const [modules, setModules] = useState<{ [unitId: string]: CourseModule[] }>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [allExpanded, setAllExpanded] = useState(false);

  // Use the custom hook for filtering
  const {
    selectedUnitId,
    filteredBookmarks,
    unitsWithBookmarks,
    selectUnit,
    hasBookmarks,
  } = useBookmarksFilter(bookmarks, units, modules);

  // Fetch user bookmarks
  const fetchBookmarks = async () => {
    try {
      const userData = await UserAPIClient.getCurrentUser();
      setBookmarks(userData.bookmarks || []);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
      setError("Failed to load bookmarks");
    }
  };

  // Fetch all units
  const fetchUnits = async () => {
    try {
      const unitsData = await CourseAPIClient.getUnits();
      setUnits(unitsData);
    } catch (err) {
      console.error("Failed to fetch units:", err);
      setError("Failed to load course units");
    }
  };

  // Fetch modules for a specific unit
  const fetchModulesForUnit = async (unitId: string) => {
    try {
      const modulesData = await CourseAPIClient.getModules(unitId);
      setModules((prev) => ({
        ...prev,
        [unitId]: modulesData,
      }));
    } catch (err) {
      console.error(`Failed to fetch modules for unit ${unitId}:`, err);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      await fetchBookmarks();
      await fetchUnits();

      setLoading(false);
    };

    loadData();
  }, []);

  // Fetch modules for units that have bookmarks
  useEffect(() => {
    const unitIdsWithBookmarks = bookmarks
      .map((b) => b.unitId)
      .filter((unitId, index, array) => array.indexOf(unitId) === index);

    unitIdsWithBookmarks.forEach((unitId) => {
      if (!modules[unitId]) {
        fetchModulesForUnit(unitId);
      }
    });
  }, [bookmarks, modules]);

  const handleUnitSelect = (unitId: string | null) => {
    selectUnit(unitId);
  };

  const handleDrawerOpen = () => {
    setSidebarOpen(true);
  };

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  // Toggle expand/collapse all
  const handleToggleAll = () => {
    setAllExpanded((prev) => !prev);
  };

  // Get the selected unit for title display
  const selectedUnit = selectedUnitId
    ? units.find((u) => u.id === selectedUnitId)
    : null;

  return (
    <Box display="flex" width="100%" minHeight="100vh">
      {/* Sidebar */}
      <BookmarksSidebar
        units={unitsWithBookmarks}
        selectedUnitId={selectedUnitId}
        onUnitSelect={handleUnitSelect}
        open={sidebarOpen}
        onClose={handleDrawerClose}
      />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: "48px" }}>
        {!loading && !error && hasBookmarks && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            paddingLeft="10px"
            marginBottom="32px"
          >
            {!sidebarOpen && (
              <Button
                type="button"
                sx={{
                  color: theme.palette.Neutral[700],
                  backgroundColor: theme.palette.Neutral[200],
                  borderRadius: "4px",
                  width: "34px",
                  minWidth: "34px",
                  height: "34px",
                  padding: 0,
                  marginRight: "12px",
                }}
                onClick={handleDrawerOpen}
              >
                <MenuOpenIcon
                  sx={{
                    fontSize: "18px",
                    transform: "scaleX(-1)",
                  }}
                />
              </Button>
            )}
            <Box display="flex" alignItems="center" gap="12px">
              <BookmarkBorderOutlinedIcon sx={{ width: "48px", height: "48px", fill: "#000"}} />
              <Typography variant="displayLarge">
                {selectedUnit
                  ? `Unit ${selectedUnit.displayIndex} Bookmarks`
                  : "Bookmarks"}
              </Typography>
            </Box>

            {/* Expand/Collapse all button */}
            <ExpandCollapseButton allExpanded={allExpanded} onToggle={handleToggleAll} />
          </Box>
        )}

        <BookmarksContent
          filteredBookmarks={filteredBookmarks}
          loading={loading}
          error={error}
          hasBookmarks={hasBookmarks}
          selectedUnitId={selectedUnitId}
          allExpanded={allExpanded}
          onBookmarkDeleted={(pageId) =>
            setBookmarks((prev) => prev.filter((b) => b.pageId !== pageId))
          }
        />
      </Box>
    </Box>
  );
};

export default Bookmarks;
