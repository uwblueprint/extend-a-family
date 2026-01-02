import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import UserAPIClient from "../../APIClients/UserAPIClient";
import useBookmarksFilter from "../../hooks/useBookmarksFilter";
import { CourseModule, CourseUnit } from "../../types/CourseTypes";
import { Bookmark } from "../../types/UserTypes";
import {
  BookmarksContent,
  BookmarksSidebar,
  ExpandCollapseButton,
} from "../bookmarks";

const Bookmarks = (): React.ReactElement => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [units, setUnits] = useState<CourseUnit[]>([]);
  const [modules, setModules] = useState<{ [unitId: string]: CourseModule[] }>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<"expand" | "collapse">(
    "expand",
  );
  const [moduleOpenMap, setModuleOpenMap] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [expandAllValue, setExpandAllValue] = useState(false);
  const [expandAllStamp, setExpandAllStamp] = useState(0);

  const fetchedUnitsRef = useRef<Set<string>>(new Set());

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
      /* eslint-disable-next-line no-console */
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
      /* eslint-disable-next-line no-console */
      console.error("Failed to fetch units:", err);
      setError("Failed to load course units");
    }
  };

  // Fetch modules for a specific unit
  const fetchModulesForUnit = async (unitId: string) => {
    // Prevent duplicate concurrent/repeated fetches for same unit
    if (fetchedUnitsRef.current.has(unitId)) return;
    fetchedUnitsRef.current.add(unitId);

    try {
      const modulesData = await CourseAPIClient.getModules(unitId);
      setModules((prev) => ({
        ...prev,
        [unitId]: modulesData,
      }));
    } catch (err) {
      /* eslint-disable-next-line no-console */
      console.error(`Failed to fetch modules for unit ${unitId}:`, err);
      fetchedUnitsRef.current.delete(unitId);
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
    const unitIdsWithBookmarks = Array.from(
      new Set(bookmarks.map((b) => b.unitId)),
    );

    unitIdsWithBookmarks.forEach((unitId) => {
      if (!fetchedUnitsRef.current.has(unitId)) {
        fetchModulesForUnit(unitId);
      }
    });
  }, [bookmarks]);

  const handleUnitSelect = (unitId: string | null) => {
    selectUnit(unitId);
  };

  // Handler to receive per-unit module open state map from UnitSection
  const handleModuleOpenStateChange = (
    unitId: string,
    state: Record<string, boolean>,
  ) => {
    setModuleOpenMap((prev) => ({ ...prev, [unitId]: state }));
  };

  // Check if all modules are currently expanded
  const allModulesExpanded = useMemo(() => {
    // Determine which specific modules we expect to track (based on bookmarks)
    const trackedModuleKeys = Array.from(
      new Set(bookmarks.map((b) => `${b.unitId}:${b.moduleId}`)),
    );
    if (trackedModuleKeys.length === 0) return false;

    // Flatten reported module keys from moduleOpenMap
    const reportedKeys: string[] = [];
    Object.entries(moduleOpenMap).forEach(([uId, modMap]) =>
      Object.keys(modMap).forEach((mId) => reportedKeys.push(`${uId}:${mId}`)),
    );

    // Only decide "all expanded" when every tracked module has reported its state
    if (reportedKeys.length < trackedModuleKeys.length) return false;

    return trackedModuleKeys.every((key) => {
      const [uId, mId] = key.split(":");
      return !!moduleOpenMap[uId] && moduleOpenMap[uId][mId] === true;
    });
  }, [moduleOpenMap, bookmarks]);

  // Check if all modules are currently collapsed
  const allModulesCollapsed = useMemo(() => {
    const trackedModuleKeys = Array.from(
      new Set(bookmarks.map((b) => `${b.unitId}:${b.moduleId}`)),
    );
    if (trackedModuleKeys.length === 0) return false;

    const reportedKeys: string[] = [];
    Object.entries(moduleOpenMap).forEach(([uId, modMap]) =>
      Object.keys(modMap).forEach((mId) => reportedKeys.push(`${uId}:${mId}`)),
    );

    // Only decide "all collapsed" when every tracked module has reported its state
    if (reportedKeys.length < trackedModuleKeys.length) return false;

    return trackedModuleKeys.every((key) => {
      const [uId, mId] = key.split(":");
      return !!moduleOpenMap[uId] && moduleOpenMap[uId][mId] === false;
    });
  }, [moduleOpenMap, bookmarks]);

  // Update button state based on module states
  useEffect(() => {
    if (allModulesExpanded) {
      setButtonState("collapse");
    } else if (allModulesCollapsed) {
      setButtonState("expand");
    }
    // If some are open and some are closed, keep the current button state
  }, [allModulesExpanded, allModulesCollapsed]);

  // Toggle expand/collapse all (button)
  const handleToggleAll = () => {
    if (buttonState === "collapse") {
      setExpandAllValue(false);
      setExpandAllStamp((s) => s + 1);
      setButtonState("expand");
    } else {
      setExpandAllValue(true);
      setExpandAllStamp((s) => s + 1);
      setButtonState("collapse");
    }
  };

  // Get the selected unit for title display
  const selectedUnit = selectedUnitId
    ? units.find((u) => u.id === selectedUnitId)
    : null;

  return (
    <Box
      display="flex"
      width="100%"
      minHeight="100vh"
      height="100vh"
      overflow="hidden"
    >
      {/* Sidebar */}
      <BookmarksSidebar
        units={unitsWithBookmarks}
        selectedUnitId={selectedUnitId}
        onUnitSelect={handleUnitSelect}
      />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: "48px", mb: "48px", overflowY: "scroll" }}>
        {!loading && !error && hasBookmarks && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            paddingLeft="10px"
            marginBottom="32px"
          >
            <Box display="flex" alignItems="center" gap="12px">
              <BookmarkBorderOutlinedIcon
                sx={{ width: "48px", height: "48px", fill: "#000" }}
              />
              <Typography variant="displayLarge">
                {selectedUnit
                  ? `Unit ${selectedUnit.displayIndex} Bookmarks`
                  : "Bookmarks"}
              </Typography>
            </Box>

            {/* Expand/Collapse all button */}
            <ExpandCollapseButton
              allExpanded={buttonState === "collapse"}
              onToggle={handleToggleAll}
            />
          </Box>
        )}

        <BookmarksContent
          filteredBookmarks={filteredBookmarks}
          loading={loading}
          error={error}
          hasBookmarks={hasBookmarks}
          selectedUnitId={selectedUnitId}
          allExpanded={expandAllValue}
          expandAllStamp={expandAllStamp}
          onModuleOpenStateChange={handleModuleOpenStateChange}
          onBookmarkDeleted={(pageId) =>
            setBookmarks((prev) => prev.filter((b) => b.pageId !== pageId))
          }
        />
      </Box>
    </Box>
  );
};

export default Bookmarks;
