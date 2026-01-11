import { Box, Stack, Typography, useTheme } from "@mui/material";

const LongRightArrow = ({ labelText }: { labelText?: string }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" gap="8px" alignItems="center" flex="1 0 0">
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minWidth: "35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "32px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "2px",
            borderRadius: "999px",
            backgroundColor: theme.palette.Neutral[400],
            "&::after": {
              content: '""',
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translate(1px, -50%)",
              width: 0,
              height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: `10px solid ${theme.palette.Neutral[400]}`,
            },
          }}
        />
        {labelText && (
          <Typography
            variant="bodySmall"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              px: 1,
              backgroundColor: theme.palette.Neutral[100],
              color: theme.palette.Neutral[700],
              whiteSpace: "nowrap",
            }}
          >
            {labelText}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export default LongRightArrow;
