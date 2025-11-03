import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Box, Link, Typography, useTheme } from "@mui/material";

export default function NotifiactionsFetchError() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        padding: "60px 24px 60px 32px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "16px",
        flex: "1 0 0",
        alignSelf: "stretch",
        backgroundColor: theme.palette.Administrator.Light.Default,
      }}
    >
      <ErrorOutlineOutlined
        sx={{
          width: "60px",
          height: "60px",
          aspectRatio: "1/1",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
          alignSelf: "stretch",
        }}
      >
        <Typography variant="titleMedium">
          Error: We could not load your messages.
        </Typography>
        <Box
          sx={{
            display: "flex",
            padding: "10px 0",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.Neutral[700],
              fontFamily: "Lexend Deca",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%" /* 19.6px */,
              letterSpacing: "0.32px",
            }}
          >
            Please refresh or try again later. <br />
            <br />
            If the error persists, please{" "}
            <Link
              href="mailto:pranol.mathan@eafwr.on.ca"
              sx={{
                color: theme.palette.Neutral[700],
                fontFamily: '"Lexend Deca"',
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                letterSpacing: "0.32px",
                textDecorationLine: "underline",
                textDecorationStyle: "solid",
                textDecorationSkipInk: "none",
                textDecorationThickness: "auto",
                textUnderlineOffset: "auto",
                textUnderlinePosition: "from-font",
              }}
            >
              contact the administrators
            </Link>
            .
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
