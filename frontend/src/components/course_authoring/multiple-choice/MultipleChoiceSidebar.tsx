import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import IOSSwitch from "../../common/form/IOSSwitch";

interface MultipleChoiceEditorSidebarProps {
  hasImage: boolean;
  setHasImage: (value: boolean) => void;
  hasAdditionalContext: boolean;
  setHasAdditionalContext: (value: boolean) => void;
  onAddQuestionOption: () => void;
  hint: string;
  setHint: (value: string) => void;
}

export default function MultipleChoiceEditorSidebar({
  hasImage,
  setHasImage,
  hasAdditionalContext,
  setHasAdditionalContext,
  onAddQuestionOption,
  hint,
  setHint,
}: MultipleChoiceEditorSidebarProps) {
  const boxHeight = "calc(100vh - 68px)";
  const theme = useTheme();
  return (
    <Box
      width="auto"
      minWidth="fit-content"
      maxHeight={boxHeight}
      padding="24px"
      sx={{
        backgroundColor: theme.palette.Neutral[100],
        overflowY: "auto",
        gapY: "24px",
        maxWidth: "400px",
        paddingBottom: "24px",
        flexDirection: "column",
        alignItems: "flex-start",
        flex: "1 0 0",
        alignSelf: "stretch",
      }}
      className="no-scrollbar"
    >
      <Box
        sx={{
          display: "flex",
          padding: "12px 12px 16px 24px",
          alignItems: "flex-start",
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "48px",
            paddingTop: "12px",
            alignItems: "flex-start",
            flex: "1 0 0",
          }}
        >
          <Typography variant="titleLarge" sx={{ flex: "1 0 0" }}>
            Select one
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          padding: "24px",
          flexDirection: "column",
          alignItems: "center",
          flex: "1 0 0",
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            paddingBottom: "24px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
            flex: "1 0 0",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              <Typography variant="titleSmall">Include</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
              }}
            >
              <Typography variant="bodySmall">Image</Typography>
              <IOSSwitch
                checked={hasImage}
                onChange={(ev) => setHasImage(ev.target.checked)}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
              }}
            >
              <Typography variant="bodySmall">Additional context</Typography>
              <IOSSwitch
                checked={hasAdditionalContext}
                onChange={(ev) => setHasAdditionalContext(ev.target.checked)}
              />
            </Box>
          </Box>
          <Divider
            sx={{
              background: theme.palette.Neutral[400],
              width: "252px",
              height: "1px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              <Typography variant="titleSmall">Question options</Typography>
              <Typography variant="bodySmall">
                Add options associated to the question
              </Typography>
            </Box>
            <Button
              sx={{
                display: "flex",
                padding: "10px 24px 10px 16px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                flex: "1 0 0",
                alignSelf: "stretch",

                borderRadius: "4px",
                border: "1px solid #1D1B201F",
              }}
              onClick={onAddQuestionOption}
            >
              <Typography
                variant="labelLarge"
                sx={{
                  color: "#171D1D",
                  opacity: 0.38,
                }}
              >
                + Add option
              </Typography>
            </Button>
          </Box>
          <Divider
            sx={{
              background: theme.palette.Neutral[400],
              width: "252px",
              height: "1px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              <Typography variant="titleSmall">Hint (Optional)</Typography>
              <Typography variant="bodySmall">
                We will display this hint if the learner answers incorrectly
              </Typography>
            </Box>
            <TextField
              placeholder="Include question hint"
              multiline
              rows={5}
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              sx={{ width: "100%" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
