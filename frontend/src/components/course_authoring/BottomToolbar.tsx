import React, { useContext } from "react";
import { Box, Button, Stack, Theme, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DoneIcon from "@mui/icons-material/Done";
import styled from "@emotion/styled";
import { CoursePage, PageType } from "../../types/CourseTypes";
import CourseAuthoringContext from "../../contexts/CourseAuthoringContext";

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

const BottomToolbar = ({
  onBuilderEnter,
  onBuilderExit,
}: BottomToolbarProps) => {
  const theme = useTheme();
  const { activePage, setActivePage } = useContext(CourseAuthoringContext);

  function createPage(pageType: PageType) {
    // TODO: Call API to create page
    const page: CoursePage = {
      id: "NEW_PAGE",
      type: pageType,
    };
    setActivePage(page);
    onBuilderEnter();
  }

  function savePage() {
    // TODO: Call API to save page
    setActivePage(null);
    onBuilderExit();
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
            startIcon={<RemoveRedEyeIcon />}
          >
            <Typography variant="labelLarge">Preview</Typography>
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
