import { ThumbDownOffAlt } from "@mui/icons-material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Box, Typography, useTheme } from "@mui/material";

export const DidYouLikeTheContentSlide = ({ liked }: { liked?: boolean }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        width: "1024px",
        padding: "244px 100px",
        justifyContent: "center",
        alignItems: "center",
      }}
      bgcolor={theme.palette.Learner.Light.Default}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="displayMedium"
          color={theme.palette.Learner.Dark.Default}
        >
          Did you like the content?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "50px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              padding: "50px",
              alignItems: "center",
              gap: "12.5px",
              borderRadius: "16px",
              border: `2px solid ${theme.palette.Learner.Dark.Default}`,
            }}
            bgcolor={liked === true ? theme.palette.Learner.Light.Selected : ""}
          >
            <ThumbUpAltIcon
              sx={{
                width: "100px",
                height: "100px",
                color: theme.palette.Learner.Dark.Default,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              padding: "50px",
              alignItems: "center",
              gap: "12.5px",
              borderRadius: "16px",
              border: `2px solid ${theme.palette.Learner.Dark.Default}`,
            }}
            bgcolor={
              liked === false ? theme.palette.Learner.Light.Selected : ""
            }
          >
            <ThumbDownOffAlt
              sx={{
                width: "100px",
                height: "100px",
                color: theme.palette.Learner.Dark.Default,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const HowEasyWasTheModuleSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold mb-4">How easy was the module?</h2>
      <div className="flex space-x-4">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Easy
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Medium
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Hard
        </button>
      </div>
    </div>
  );
};
