import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useUser } from "../../../hooks/useUser";
import CourseAPIClient from "../../../APIClients/CourseAPIClient";
import { CourseModule } from "../../../types/CourseTypes";
import { useFeedbacks } from "../../../contexts/FeedbacksContext";

interface PublishModuleModalProps {
  openPublishModuleModal: boolean;
  handleClosePublishModuleModal: () => void;
  moduleId: string;
  onUpdateModule: (updatedModule: CourseModule) => void;
}

enum RetainFeedbackOption {
  RETAIN = "retain",
  DISCARD = "discard",
}

export default function PublishModuleModal(props: PublishModuleModalProps) {
  const theme = useTheme();
  const user = useUser();
  const {
    openPublishModuleModal,
    handleClosePublishModuleModal,
    moduleId,
    onUpdateModule,
  } = props;
  const { exportFeedbackToTSV } = useFeedbacks();

  const [retainFeedback, setRetainFeedback] = useState<
    RetainFeedbackOption | undefined
  >(undefined);

  const handlePublish = async () => {
    const updatedModule = await CourseAPIClient.publishModule(
      moduleId,
      retainFeedback,
    );
    if (updatedModule) onUpdateModule(updatedModule);
    handleClosePublishModuleModal();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dialog
        open={openPublishModuleModal}
        onClose={handleClosePublishModuleModal}
        PaperProps={{
          sx: {
            display: "flex",
            width: "600px",
            padding: "32px",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: "32px",
          },
        }}
      >
        <Box>
          <Box>
            <IconButton
              onClick={handleClosePublishModuleModal}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogTitle
            sx={{
              margin: "0px",
              padding: "0px",
              marginBottom: "12px",
            }}
          >
            <Typography
              variant="headlineMedium"
              color={theme.palette.Neutral[700]}
            >
              Publish Module?
            </Typography>
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              margin: "0px",
              padding: "0px",
            }}
          >
            <Stack direction="column" gap="12px">
              <Typography
                variant="bodyMedium"
                color={theme.palette.Neutral[700]}
              >
                Publishing makes this module visible to learners.
              </Typography>
            </Stack>
            <Stack direction="column" gap="8px">
              <Typography
                variant="titleMedium"
                color={theme.palette.Neutral[700]}
              >
                Learner feedback
              </Typography>
              <Typography variant="bodySmall">
                What should happen to existing feedback?
              </Typography>
            </Stack>
            <FormControl>
              <RadioGroup
                aria-labelledby="learner-feedback-decision-radio-group"
                name="learner-feedback-decision-radio-group"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                }}
                onChange={(ev) =>
                  setRetainFeedback(ev.target.value as RetainFeedbackOption)
                }
              >
                <FormControlLabel
                  value={RetainFeedbackOption.RETAIN}
                  control={
                    <Radio
                      sx={{
                        color: theme.palette.Administrator.Dark.Default,
                        "&.Mui-checked": {
                          color: theme.palette.Administrator.Dark.Default,
                        },
                      }}
                    />
                  }
                  label={
                    <Stack direction="column" spacing="4px">
                      <Typography variant="bodyMedium">
                        Retain existing feedback
                      </Typography>
                      <Typography variant="bodySmall" color="text.secondary">
                        Previous feedback will still be accessible to
                        facilitators.
                      </Typography>
                    </Stack>
                  }
                />
                <FormControlLabel
                  value={RetainFeedbackOption.DISCARD}
                  control={
                    <Radio
                      sx={{
                        color: theme.palette.Administrator.Dark.Default,
                        "&.Mui-checked": {
                          color: theme.palette.Administrator.Dark.Default,
                        },
                      }}
                    />
                  }
                  label={
                    <Stack direction="column" spacing="4px">
                      <Typography variant="bodyMedium">
                        Reset feedback
                      </Typography>
                      <Typography variant="bodySmall" color="text.secondary">
                        Previous feedback will be deleted and not accessible to
                        facilitators.
                      </Typography>
                      <Typography
                        variant="bodyMedium"
                        color={theme.palette.Administrator.Dark.Default}
                        sx={{
                          textDecorationLine: "underline",
                          textDecorationStyle: "solid",
                          textDecorationSkipInk: "auto",
                          textDecorationThickness: "auto",
                          textUnderlineOffset: "auto",
                          textUnderlinePosition: "from-font",
                          "&:hover": {
                            cursor: "pointer",
                            color: theme.palette.Administrator.Dark.Hover,
                          },
                        }}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          ev.preventDefault();
                          exportFeedbackToTSV();
                        }}
                      >
                        Download old feedback (TSV)
                      </Typography>
                    </Stack>
                  }
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            disableElevation
            sx={{
              display: "flex",
              height: "40px",
              gap: "8px",
              "&:hover": {
                bgcolor: theme.palette.Administrator.Light.Hover,
              },
              borderColor: theme.palette.Administrator.Dark.Default,
            }}
            onClick={handleClosePublishModuleModal}
          >
            <Typography
              variant="labelLarge"
              color={theme.palette[user.role].Dark.Default}
            >
              GO BACK
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{
              display: "flex",
              height: "40px",
              gap: "8px",
              backgroundColor: theme.palette.Administrator.Dark.Default,
              "&:hover": {
                bgcolor: theme.palette.Administrator.Dark.Hover,
              },
            }}
            onClick={handlePublish}
            disableElevation
            disabled={!retainFeedback}
          >
            <Typography variant="labelLarge">Publish</Typography>
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
