import { Image } from "@mui/icons-material";
import TitleIcon from "@mui/icons-material/Title";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";

interface MatchingSidebarProps {
  numColumns: number;
  setNumColumns: (value: number) => void;
  onAddRow: () => void;
  isAddRowDisabled: boolean;
  hint: string;
  setHint: (value: string) => void;
}

export default function MatchingSidebar({
  numColumns,
  setNumColumns,
  onAddRow,
  isAddRowDisabled,
  hint,
  setHint,
}: MatchingSidebarProps) {
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
        width: "fit-content",
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
            Matching
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
              <Typography variant="titleSmall">Add row</Typography>
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
                border: `1px solid ${theme.palette.Neutral[500]}`,
              }}
              onClick={onAddRow}
              disabled={isAddRowDisabled}
            >
              <Typography
                variant="labelLarge"
                sx={{
                  color: theme.palette.Administrator.Dark.Default,
                }}
              >
                + Add row
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
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
              alignSelf: "stretch",
            }}
          >
            <Typography variant="bodyMedium">Columns</Typography>
            <ToggleButtonGroup
              value={numColumns}
              onChange={(_, newValue) => setNumColumns(Number(newValue))}
              exclusive
              fullWidth
              aria-label="num-columns-in-matching"
            >
              <ToggleButton value={2} aria-label="2-columns">
                <Typography variant="labelMedium">2 Columns</Typography>
              </ToggleButton>
              <ToggleButton value={3} aria-label="3-columns">
                <Typography variant="labelMedium">3 Columns</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
              alignSelf: "stretch",
            }}
          >
            <Typography variant="bodyMedium">Column Type</Typography>
            <Stack
              direction="column"
              gap="12px"
              alignItems="flex-start"
              alignSelf="stretch"
            >
              {Array.from({ length: numColumns }, (_, index) => index + 1).map(
                (columnNumber) => (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    alignSelf="stretch"
                  >
                    <Typography variant="bodySmall">Column 1</Typography>
                    <Select
                      sx={{
                        display: "flex",
                        width: "116px",
                        height: "40px",
                        color: theme.palette.Administrator.Dark.Default,

                        borderRadius: "4px",
                        border: `1px solid ${theme.palette.Neutral[500]}`,
                      }}
                      renderValue={(selected: string) => (
                        <Typography variant="labelMedium">
                          {selected}
                        </Typography>
                      )}
                    >
                      <MenuItem key="image" value="image">
                        <Stack direction="row" alignItems="center" gap="12px">
                          <Image />
                          <Typography variant="bodySmall">Image</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem key="text" value="text">
                        <Stack direction="row" alignItems="center" gap="12px">
                          <TitleIcon />
                          <Typography variant="bodySmall">Text</Typography>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </Stack>
                ),
              )}
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
