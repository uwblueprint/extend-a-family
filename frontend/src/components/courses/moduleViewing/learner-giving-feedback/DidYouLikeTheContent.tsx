import {
  ThumbDownAlt,
  ThumbDownOffAlt,
  ThumbUpOffAlt,
} from "@mui/icons-material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Box, Typography, useTheme } from "@mui/material";

const DidYouLikeTheContentSlide = ({
  contentLiked,
  setContentLiked,
}: {
  contentLiked?: boolean;
  setContentLiked: (liked: boolean) => void;
}) => {
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
            bgcolor={
              contentLiked === true ? theme.palette.Learner.Light.Selected : ""
            }
            onClick={() => setContentLiked(true)}
          >
            {contentLiked === true ? (
              <ThumbUpAltIcon
                sx={{
                  width: "100px",
                  height: "100px",
                  color: theme.palette.Learner.Dark.Default,
                }}
              />
            ) : (
              <ThumbUpOffAlt
                sx={{
                  width: "100px",
                  height: "100px",
                  color: theme.palette.Learner.Dark.Default,
                }}
              />
            )}
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
              contentLiked === false ? theme.palette.Learner.Light.Selected : ""
            }
            onClick={() => setContentLiked(false)}
          >
            {contentLiked === false ? (
              <ThumbDownAlt
                sx={{
                  width: "100px",
                  height: "100px",
                  color: theme.palette.Learner.Dark.Default,
                }}
              />
            ) : (
              <ThumbDownOffAlt
                sx={{
                  width: "100px",
                  height: "100px",
                  color: theme.palette.Learner.Dark.Default,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DidYouLikeTheContentSlide;
