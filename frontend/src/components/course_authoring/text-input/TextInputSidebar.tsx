import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Numbers, Subject, Close } from "@mui/icons-material";
import IOSSwitch from "../../common/form/IOSSwitch";

interface TextInputEditorSidebarProps {
  mode: "short_answer" | "numeric_range";
  setMode: (value: "short_answer" | "numeric_range") => void;
  hasImage: boolean;
  setHasImage: (value: boolean) => void;
  hasAdditionalContext: boolean;
  setHasAdditionalContext: (value: boolean) => void;
  hint: string;
  setHint: (value: string) => void;
  correctAnswers: string[];
  setCorrectAnswers: (value: string[]) => void;
}

export default function TextInputEditorSidebar({
  mode,
  setMode,
  hasImage,
  setHasImage,
  hasAdditionalContext,
  setHasAdditionalContext,
  hint,
  setHint,
  correctAnswers,
  setCorrectAnswers,
}: TextInputEditorSidebarProps) {
  const boxHeight = "calc(100vh - 68px)";
  const theme = useTheme();
  const [currentAnswer, setCurrentAnswer] = useState("");

  const handleAddAnswer = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (currentAnswer.trim()) {
      setCorrectAnswers([
        ...correctAnswers,
        currentAnswer.trim().toLocaleLowerCase(),
      ]);
      setCurrentAnswer("");
    }
  };

  const handleDeleteAnswer = (index: number) => {
    setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
  };
  return (
    <Box
      maxHeight={boxHeight}
      padding="24px"
      sx={{
        backgroundColor: theme.palette.Neutral[100],
        minWidth: "300px",
        maxWidth: "fit-content",
        overflowY: "auto",
        gapY: "24px",
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
            Input
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
              <Typography variant="titleSmall">Input type</Typography>
              <Typography variant="bodySmall" color="#6F797B">
                Change input type
              </Typography>
            </Box>
            <Select
              value={mode}
              onChange={(e) =>
                setMode(e.target.value as "short_answer" | "numeric_range")
              }
              sx={{
                display: "flex",
                height: "40px",
                width: "100%",
                color: theme.palette.Administrator.Dark.Default,
                borderRadius: "4px",
                border: `1px solid ${theme.palette.Neutral[500]}`,
              }}
            >
              <MenuItem value="short_answer">
                <Stack direction="row" alignItems="center" gap="12px">
                  <Subject />
                  <Typography variant="bodySmall">Short answer</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="numeric_range">
                <Stack direction="row" alignItems="center" gap="12px">
                  <Numbers />
                  <Typography variant="bodySmall">Number</Typography>
                </Stack>
              </MenuItem>
            </Select>
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
              <Typography variant="titleSmall">Text input answers</Typography>
            </Box>
            <form onSubmit={handleAddAnswer} style={{ width: "100%" }}>
              <Stack direction="row" alignItems="center" gap="8px">
                <TextField
                  variant="outlined"
                  placeholder="Enter an answer..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  sx={{ width: "100%" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.Administrator.Dark.Default,
                    color: "white",
                  }}
                >
                  Add
                </Button>
              </Stack>
            </form>
            <Stack spacing={1} sx={{ width: "100%" }}>
              {correctAnswers.map((answer, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: theme.palette.Neutral[200],
                    borderRadius: "4px",
                  }}
                >
                  <Typography variant="bodySmall">{answer}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAnswer(index)}
                    sx={{
                      color: theme.palette.Neutral[700],
                      "&:hover": {
                        backgroundColor: theme.palette.Neutral[300],
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
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
              defaultValue={hint}
              onChange={(e) => setHint(e.target.value)}
              sx={{ width: "100%" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
