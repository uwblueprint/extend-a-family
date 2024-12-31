import React, { useContext } from "react";
import { Box, Button, Stack, Theme, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
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

type BottomToolbarProps = {
  onBuilderEnter: () => void;
  onBuilderExit: () => void;
};

const BottomToolbar = ({
  onBuilderEnter,
  onBuilderExit,
}: BottomToolbarProps) => {
  const theme = useTheme();
  const { setActivePage } = useContext(CourseAuthoringContext);

  function createNewPage(pageType: PageType) {
    // TODO: Call API to create page
    const page: CoursePage = {
      id: "abcd",
      type: pageType,
    };
    setActivePage(page);
    onBuilderEnter();
  }

  return (
    <Box
      sx={{ padding: 0, height: "40px", display: "flex", flexDirection: "row" }}
    >
      <Stack direction="row" spacing="12px">
        <StyledButton
          variant="contained"
          color="Administrator"
          startIcon={<FileUploadIcon />}
          onClick={() => createNewPage("Lesson")}
        >
          <Typography variant="labelLarge">Upload page</Typography>
        </StyledButton>
        <StyledButton
          variant="outlined"
          sx={outlinedButtonStyle(theme)}
          startIcon={<AddIcon />}
          onClick={() => createNewPage("Activity")}
        >
          <Typography variant="labelLarge">Create activity</Typography>
        </StyledButton>
        <StyledButton
          variant="outlined"
          sx={outlinedButtonStyle(theme)}
          startIcon={<RemoveRedEyeIcon />}
          onClick={onBuilderExit}
        >
          <Typography variant="labelLarge">Preview</Typography>
        </StyledButton>
      </Stack>
    </Box>
  );
};

export default BottomToolbar;
