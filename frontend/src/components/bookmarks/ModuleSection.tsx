import React, { useEffect, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
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
import CourseAPIClient from "../../APIClients/CourseAPIClient";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

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
  onBookmarkDeleted?: (pageId: string) => void;
  expandAll?: boolean;
}

const ModuleSection: React.FC<ModuleSectionProps> = ({
  module,
  bookmarks,
  onBookmarkDeleted,
  expandAll = false,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [lessonPdfUrl, setLessonPdfUrl] = useState<string | null>(null);
  const [detailedModule, setDetailedModule] = useState<
    (CourseModule & { lessonPdfUrl: string }) | null
  >(null);

  // Sync expanded state when global expandAll changes
  useEffect(() => {
    setExpanded(Boolean(expandAll));
  }, [expandAll]);

  // Fetch module details to get lesson PDF URL and populated pages for thumbnails
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const detailed = await CourseAPIClient.getModuleById(module.id);
      if (isMounted && detailed) {
        setLessonPdfUrl(detailed.lessonPdfUrl || null);
        setDetailedModule(detailed);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [module.id]);

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
            Module {module.displayIndex}: {module.title}
          </Typography>
          <Typography sx={{ ...theme.typography.labelLarge }}>
            {activityCount} bookmarked {activityLabel}, {slideCount} bookmarked{" "}
            {slideLabel}
          </Typography>
        </Box>
      </AccordionSummary>

      {/* Content */}
      <AccordionDetails
        sx={{
          padding: "32px 32px 42px 32px",
        }}
      >
        <Document file={lessonPdfUrl || null} options={options}>
          <ModuleBookmarksGrid
            module={detailedModule || module}
            bookmarks={bookmarks}
            onBookmarkDeleted={onBookmarkDeleted}
          />
        </Document>
      </AccordionDetails>
    </Accordion>
  );
};

export default ModuleSection;
