import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CourseUnit, CourseModule } from "../../types/CourseTypes";
import ModulesGrid from "./ModulesGrid";

interface UnitSectionProps {
  unit: CourseUnit;
  modules: CourseModule[];
  expandAll?: boolean;
  expandAllStamp?: number;
  onToggle?: (isOpen: boolean) => void;
}

const UnitSection: React.FC<UnitSectionProps> = ({
  unit,
  modules,
  expandAll = false,
  expandAllStamp,
  onToggle,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Sync when expandAll changes OR when a command id changes (button press)
  useEffect(() => {
    setExpanded(Boolean(expandAll));
  }, [expandAll, expandAllStamp]);

  // Count modules
  const moduleCount = modules.length;
  const moduleLabel = moduleCount === 1 ? "module" : "modules";

  return (
    <Accordion
      disableGutters
      expanded={expanded}
      onChange={(_, isExpanded) => {
        setExpanded(isExpanded);
        if (onToggle) onToggle(isExpanded);
      }}
      sx={{
        border: "1px solid",
        borderColor: theme.palette.Neutral[300],
        borderRadius: "8px",
        boxShadow: "none",
      }}
    >
      {/* Header */}
      <AccordionSummary
        expandIcon={
          <ArrowDropDownIcon
            sx={{
              width: "43.192px",
              height: "37.831px",
              color: "#000000",
            }}
          />
        }
        sx={{
          width: "100%",
          backgroundColor: expanded ? "#F5F5F5" : "transparent",
          padding: "30px 32px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
            flex: "1 0 0",
          }}
        >
          <Typography sx={{ ...theme.typography.titleLarge }}>
            Unit {unit.displayIndex}: {unit.title}
          </Typography>
          <Typography sx={{ ...theme.typography.labelLarge }}>
            {moduleCount} {moduleLabel}
          </Typography>
        </Box>
      </AccordionSummary>

      {/* Content */}
      <AccordionDetails
        sx={{
          padding: "32px 32px 42px 32px",
        }}
      >
        <ModulesGrid modules={modules} unitId={unit.id} />
      </AccordionDetails>
    </Accordion>
  );
};

export default UnitSection;
