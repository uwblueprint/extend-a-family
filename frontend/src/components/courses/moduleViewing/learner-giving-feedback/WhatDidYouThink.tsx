import { Box, TextField, Typography, useTheme } from "@mui/material";
import { Button } from "react-bootstrap";

const WhatDidYouThink = ({
  text,
  onChange,
  onSubmit,
}: {
  text: string;
  onChange: (newValue: string) => void;
  onSubmit: () => void;
}) => {
  const theme = useTheme();
  const charactersLeft = 500 - text.length;
  return (
    <Box
      sx={{
        display: "inline-flex",
        width: "100%",
        padding: "177.5px 212px 178.5px 212px",
        justifyContent: "center",
        alignItems: "center",
      }}
      bgcolor={theme.palette.Learner.Light.Default}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "32px",
          flex: "1 0 0",
          alignSelf: "stretch",
        }}
      >
        <Typography
          variant="displayMedium"
          color={theme.palette.Learner.Dark.Default}
          sx={{ alignSelf: "stretch" }}
        >
          What did you think of the module?
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
            alignSelf: "stretch",
            width: "100%",
          }}
        >
          <TextField
            variant="outlined"
            multiline
            rows={9}
            label="What did you like? What can be improved?"
            placeholder="I thought..."
            sx={{
              width: "100%",
            }}
            slotProps={{
              inputLabel: {
                sx: {
                  color: theme.palette.Neutral[600],
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  letterSpacing: "0.32px",
                  "&.MuiOutlinedInput-notchedOutline": { fontSize: "14px" },
                },
              },
            }}
            value={text}
            onChange={(e) =>
              e.target.value.length <= 500 && onChange(e.target.value)
            }
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="bodySmall"
              color={
                charactersLeft < 0
                  ? theme.palette.Error.Dark.Default
                  : "#3F484B"
              }
            >
              {charactersLeft} characters left
            </Typography>
            <Button variant="contained" color="primary" onClick={onSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WhatDidYouThink;
