import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { CourseModule } from "../../types/CourseTypes";
import ModuleBookmarksGrid from "./ModuleBookmarksGrid";

interface ModuleSectionProps {
  module: CourseModule;
  bookmarks: Array<{
    id: string;
    title: string;
    type: string;
    unitId: string;
    moduleId: string;
    pageId: string;
  }>;
}

const ModuleSection: React.FC<ModuleSectionProps> = ({ module, bookmarks }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Count slides and activities 
  const slideCount = bookmarks.filter((b) => b.type === "Lesson").length;
  const activityCount = bookmarks.filter((b) => b.type !== "Lesson").length;

  // Handle pluralization
  const slideLabel = slideCount === 1 ? "slide" : "slides";
  const activityLabel = activityCount === 1 ? "activity" : "activities";

  return (
    <Accordion
      disableGutters
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      sx={{
        border: "1px solid var(--Neutral-300, #D1D2D4)",
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
          backgroundColor: expanded ? "var(--Surface-Hover, #F5F5F5)" : "transparent",
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
            Module {module.displayIndex}: {module.title}
          </Typography>
          <Typography sx={{ ...theme.typography.labelLarge }}>
            {activityCount} bookmarked {activityLabel}, {slideCount} bookmarked {slideLabel}
          </Typography>
        </Box>
      </AccordionSummary>

      {/* Content */}
      <AccordionDetails
        sx={{
          padding: "32px 32px 42px 32px",
        }}
      >
        <ModuleBookmarksGrid bookmarks={bookmarks} />
      </AccordionDetails>
    </Accordion>
  );
};

export default ModuleSection;
