import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import { HOME_PAGE } from "../../constants/Routes";
import { CourseModule, CourseUnit } from "../../types/CourseTypes";
import { ExpandCollapseButton } from "../bookmarks";
import { FinishedModulesContent } from "../finished_modules";
import LearnerUnitSidebar from "../learners/HomePageSidebar";

const FinishedModules = (): React.ReactElement => {
  const theme = useTheme();
  const history = useHistory();
  const [units, setUnits] = useState<CourseUnit[]>([]);
  const [modules, setModules] = useState<{ [unitId: string]: CourseModule[] }>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<"expand" | "collapse">(
    "expand",
  );
  const [unitOpenMap, setUnitOpenMap] = useState<Record<string, boolean>>({});
  const [expandAllValue, setExpandAllValue] = useState(false);
  const [expandAllStamp, setExpandAllStamp] = useState(0);

  // Fetch all units
  const fetchUnits = async () => {
    try {
      const unitsData = await CourseAPIClient.getUnits();
      setUnits(unitsData);
      return unitsData;
    } catch (err) {
      /* eslint-disable-next-line no-console */
      console.error("Failed to fetch units:", err);
      setError("Failed to load course units");
      return [];
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
      /* eslint-disable-next-line no-console */
      console.error(`Failed to fetch modules for unit ${unitId}:`, err);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      const fetchedUnits = await fetchUnits();

      // Fetch modules for all units
      await Promise.all(
        fetchedUnits.map((unit) => fetchModulesForUnit(unit.id)),
      );

      setLoading(false);
    };

    loadData();
  }, []);

  // Handler to receive unit open state
  const handleUnitOpenStateChange = (unitId: string, isOpen: boolean) => {
    setUnitOpenMap((prev) => ({ ...prev, [unitId]: isOpen }));
  };

  // Check if all units are currently expanded
  const allUnitsExpanded = useMemo(() => {
    if (units.length === 0) return false;
    const reportedCount = Object.keys(unitOpenMap).length;
    if (reportedCount < units.length) return false;

    return units.every((unit) => unitOpenMap[unit.id] === true);
  }, [unitOpenMap, units]);

  // Check if all units are currently collapsed
  const allUnitsCollapsed = useMemo(() => {
    if (units.length === 0) return false;
    const reportedCount = Object.keys(unitOpenMap).length;
    if (reportedCount < units.length) return false;

    return units.every((unit) => unitOpenMap[unit.id] === false);
  }, [unitOpenMap, units]);

  // Update button state based on unit states
  useEffect(() => {
    if (allUnitsExpanded) {
      setButtonState("collapse");
    } else if (allUnitsCollapsed) {
      setButtonState("expand");
    }
  }, [allUnitsExpanded, allUnitsCollapsed]);

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

  return (
    <Box
      display="flex"
      width="100%"
      minHeight="100vh"
      height="100vh"
      overflow="hidden"
    >
      {/* Sidebar */}
      <LearnerUnitSidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: "48px", mb: "48px", overflowY: "scroll" }}>
        {!loading && !error && units.length > 0 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="32px"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap="12px"
            >
              <Button
                onClick={() => history.push(HOME_PAGE)}
                startIcon={<ArrowBackIcon sx={{ fontSize: "12px" }} />}
                sx={{
                  padding: "12px",
                  color: theme.palette.Learner.Dark.Default,
                }}
              >
                <Typography variant="labelLarge">Back</Typography>
              </Button>
              <Typography variant="displayLarge">Finished Modules</Typography>
            </Box>

            {/* Expand/Collapse all button */}
            <ExpandCollapseButton
              allExpanded={buttonState === "collapse"}
              onToggle={handleToggleAll}
            />
          </Box>
        )}

        <FinishedModulesContent
          units={units}
          modules={modules}
          loading={loading}
          error={error}
          allExpanded={expandAllValue}
          expandAllStamp={expandAllStamp}
          onUnitOpenStateChange={handleUnitOpenStateChange}
        />
      </Box>
    </Box>
  );
};

export default FinishedModules;
