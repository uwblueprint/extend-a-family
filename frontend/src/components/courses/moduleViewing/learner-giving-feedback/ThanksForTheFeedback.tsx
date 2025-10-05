import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Typography, useTheme } from "@mui/material";

const ThanksForTheFeedbackSlide = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        width: "1024px",
        height: "768px",
        padding: "0 274px",
        justifyContent: "center",
        alignItems: "center",
      }}
      bgcolor={theme.palette.Learner.Light.Default}
    >
      <Box
        sx={{
          display: "flex",
          width: "476px",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          flexShrink: 0,
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: "100px", color: theme.palette.Learner.Dark.Default }}
        />
        <Typography
          variant="displayMedium"
          sx={{ color: theme.palette.Learner.Dark.Default }}
        >
          Thanks for the feedback!
        </Typography>
      </Box>
    </Box>
  );
};

export default ThanksForTheFeedbackSlide;
