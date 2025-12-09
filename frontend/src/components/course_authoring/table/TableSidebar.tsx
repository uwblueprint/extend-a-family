import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

export enum HeaderColumnIncludesTypes {
  IMAGE = "image",
  TEXT = "text",
  IMAGE_AND_TEXT = "image_and_text",
}

interface TableSidebarProps {
  numColumns: number;
  setNumColumns: (value: number) => void;
  // headerColumnIncludes: HeaderColumnIncludesTypes;
  // setHeaderColumnIncludes: (value: HeaderColumnIncludesTypes) => void;
  onAddRow: () => void;
  isAddRowDisabled: boolean;
  hint: string;
  setHint: (value: string) => void;
}

export default function TableSidebar({
  numColumns,
  setNumColumns,
  // headerColumnIncludes,
  // setHeaderColumnIncludes,
  onAddRow,
  isAddRowDisabled,
  hint,
  setHint,
}: TableSidebarProps) {
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
            Table
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
              <Typography variant="bodyMedium">Table columns</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              <Typography variant="bodySmall">Number of columns</Typography>
              <Select
                value={numColumns}
                onChange={(e) => setNumColumns(Number(e.target.value))}
                sx={{
                  display: "flex",
                  height: "40px",
                  width: "100%",
                  color: theme.palette.Administrator.Dark.Default,

                  borderRadius: "4px",
                  border: `1px solid ${theme.palette.Neutral[500]}`,
                }}
              >
                {[2, 3, 4, 5].map((numCols) => (
                  <MenuItem key={numCols} value={numCols}>
                    {numCols - 1} Column{numCols - 1 !== 1 ? "s" : ""}
                  </MenuItem>
                ))}
              </Select>
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
              <Typography variant="bodyMedium">Table rows</Typography>
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
