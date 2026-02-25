import { Add, DescriptionOutlined, FileUpload } from "@mui/icons-material";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import ActivityAPIClient from "../../APIClients/ActivityAPIClient";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import {
  questionTypeIcons,
  questionTypeLabels,
} from "../../constants/ActivityLabels";
import { CourseModule, QuestionType } from "../../types/CourseTypes";
import VisuallyHiddenInput from "../common/form/VisuallyHiddenInput";

export const EmptyModuleLeftSidebar = () => {
  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      gap="32px"
      alignSelf="stretch"
      width="230px"
    >
      <Box
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "2px solid black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DescriptionOutlined />
      </Box>
      <Typography variant="titleMedium">No pages added yet</Typography>
      <Typography variant="bodyMedium">
        Please upload lesson pages or create an activity page to get started.
      </Typography>
    </Stack>
  );
};

export const AddYourFirstPageSlide = ({
  moduleId,
  refreshModule,
}: {
  moduleId: string;
  refreshModule: (updatedModule: CourseModule) => void;
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleActivityButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActivityTypeSelect = (questionType: QuestionType) => {
    handleClose();
    ActivityAPIClient.createActivity(moduleId, questionType)
      .then((result) => {
        if (result) {
          refreshModule(result);
        } else {
          // eslint-disable-next-line no-alert
          alert(
            "Failed to create activity, please try again. If the issue persists, please contact us.",
          );
        }
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error("Failed to create activity:", error);
        /* eslint-disable-next-line no-alert */
        alert(
          `Failed to create activity, please try again. If the issue persists, please contact us.`,
        );
      });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length === 0) {
      // eslint-disable-next-line no-alert
      alert("Error: No file selected to upload");
      return;
    }
    const file = files[0];
    CourseAPIClient.lessonUpload(file, moduleId)
      .then(refreshModule)
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error("Failed to upload lesson page:", error);
        /* eslint-disable-next-line no-alert */
        alert(
          `Failed to upload lesson page, please try again. If the issue persists, please contact us.`,
        );
      });
  };

  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        padding: "178.5px 0 179.5px 0",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",

        borderRadius: 8,
        border: `1px dashed ${theme.palette.Administrator.Dark.Default}`,
        background: theme.palette.Administrator.Light.Default,
      }}
    >
      <Stack
        direction="column"
        width="220px"
        alignItems="center"
        gap="32px"
        alignSelf="stretch"
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap="12px"
          alignSelf="stretch"
        >
          <Typography variant="titleMedium">Add your first page</Typography>
          <Typography variant="bodyMedium">
            Please upload lesson pages or create an activity page to get
            started.
          </Typography>
        </Stack>
        <Stack
          direction="column"
          gap="12px"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            component="label"
            sx={{
              display: "flex",
              padding: "10px 24px 10px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              flex: "1 0 0",
              alignSelf: "stretch",

              backgroundColor: theme.palette.Administrator.Dark.Default,
              color: "white",
            }}
          >
            <FileUpload />
            <Typography variant="labelLarge">Upload page(s)</Typography>
            <VisuallyHiddenInput
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              multiple
            />
          </Button>
          <Button
            sx={{
              display: "flex",
              padding: "10px 24px 10px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              flex: "1 0 0",
              alignSelf: "stretch",

              color: theme.palette.Administrator.Dark.Default,
              border: `1px solid ${theme.palette.Neutral[500]}`,
            }}
            onClick={handleActivityButtonClick}
            aria-controls={open ? "activity-type-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Add />
            <Typography variant="labelLarge">Create activity</Typography>
          </Button>
          <Menu
            id="activity-type-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "activity-type-button",
            }}
          >
            {Object.values(QuestionType).map((type) => (
              <MenuItem
                key={type}
                onClick={() => handleActivityTypeSelect(type)}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="8px"
                  color={theme.palette.Administrator.Dark.Default}
                >
                  {questionTypeIcons[type]} {questionTypeLabels[type]}
                </Stack>
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};
