import React, { useContext } from "react";
import { Box, Button, Stack, Theme, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneIcon from "@mui/icons-material/Done";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import {
  ActivityPage,
  isActivityPage,
  PageType,
} from "../../types/CourseTypes";
import CourseAuthoringContext from "../../contexts/CourseAuthoringContext";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import { getErrorMessage } from "../../utils/ErrorUtils";
import { ActivityDataContext } from "../../contexts/ActivityDataContext";
import { ActivityLayoutContext } from "../../contexts/ActivityLayoutContext";

const StyledButton = styled(Button)`
  height: 40px;
  border-radius: 4px;
`;

const outlinedButtonStyle = (theme: Theme) => ({
  color: theme.palette.Administrator.Default,
  borderColor: theme.palette.Neutral[500],
  "&:hover": {
    bgcolor: theme.palette.Administrator.Light,
    borderColor: theme.palette.Neutral[500],
  },
});

const containedButtonStyle = (theme: Theme) => ({
  color: theme.palette.Neutral[100],
  bgcolor: theme.palette.Administrator.Default,
  "&:hover": {
    bgcolor: theme.palette.Administrator.Default,
  },
});

type BottomToolbarProps = {
  onBuilderEnter: () => void;
  onBuilderExit: () => void;
};

type CourseAuthoringParams = {
  unitId: string;
  moduleId: string;
};

const BottomToolbar = ({
  onBuilderEnter,
  onBuilderExit,
}: BottomToolbarProps) => {
  const { unitId, moduleId } = useParams<CourseAuthoringParams>();
  const { activePage, setActivePage, previewMode, setPreviewMode } = useContext(
    CourseAuthoringContext,
  );
  const { layout, dispatchLayout } = useContext(ActivityLayoutContext);
  const { elements, setElements } = useContext(ActivityDataContext);
  const theme = useTheme();

  function createPage(pageType: PageType) {
    if (pageType === "Activity") {
      const page: ActivityPage = {
        id: "", // placeholder
        type: pageType,
        elements: [],
      };
      setActivePage(page);
    }

    onBuilderEnter();
  }

  async function savePage() {
    if (!activePage) {
      throw new Error("active page is null");
    }

    if (isActivityPage(activePage)) {
      try {
        await CourseAPIClient.saveActivityPage(
          unitId,
          moduleId,
          activePage,
          layout,
          elements,
        );
        // Reset page, layout, elements
        setActivePage(null);
        dispatchLayout({ type: "reset" });
        setElements(new Map());
        setPreviewMode(false);
        onBuilderExit();
      } catch (e: unknown) {
        alert(`Failed to save page: ${getErrorMessage(e)}`);
      }
    }
  }

  function togglePreview() {
    setPreviewMode(!previewMode);
  }

  return (
    <Box
      sx={{ padding: 0, height: "40px", display: "flex", flexDirection: "row" }}
    >
      {activePage ? (
        <Stack direction="row" spacing="12px">
          <StyledButton
            variant="contained"
            color="Administrator"
            startIcon={<DoneIcon />}
            onClick={() => savePage()}
          >
            <Typography variant="labelLarge">Save</Typography>
          </StyledButton>
          <StyledButton
            variant="outlined"
            sx={outlinedButtonStyle(theme)}
            startIcon={
              previewMode ? <EditOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />
            }
            onClick={() => togglePreview()}
          >
            <Typography variant="labelLarge">
              {previewMode ? "Edit" : "Preview"}
            </Typography>
          </StyledButton>
        </Stack>
      ) : (
        <Stack direction="row" spacing="12px">
          <StyledButton
            variant="contained"
            sx={containedButtonStyle(theme)}
            startIcon={<FileUploadIcon />}
            onClick={() => createPage("Lesson")}
            disabled={!!activePage}
          >
            <Typography variant="labelLarge">Upload page</Typography>
          </StyledButton>
          <StyledButton
            variant="outlined"
            sx={outlinedButtonStyle(theme)}
            startIcon={<AddIcon />}
            onClick={() => createPage("Activity")}
            disabled={!!activePage}
          >
            <Typography variant="labelLarge">Create activity</Typography>
          </StyledButton>
        </Stack>
      )}
    </Box>
  );
};

export default BottomToolbar;
