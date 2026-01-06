import { ModeCommentOutlined } from "@mui/icons-material";
import { Button, CardMedia, Stack, Typography, useTheme } from "@mui/material";
import type { MouseEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Routes from "../../../constants/Routes";
import { CourseModule } from "../../../types/CourseTypes";
import BlankImg from "../../assets/blankSlide.png";

const ModuleCardFacilitator = ({ module }: { module: CourseModule }) => {
  const theme = useTheme();
  const history = useHistory();

  const viewFeedbackUrl = `${Routes.FEEDBACK_PAGE}?moduleId=${module.id}`;
  const handleFeedbackClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    history.push(viewFeedbackUrl);
  };
  return (
    <Stack
      component={Link}
      to={`${Routes.VIEW_PAGE}?moduleId=${module.id}`}
      direction="column"
      gap="12px"
      padding="16px"
      alignItems="flex-start"
      flex="1 0 0"
      minWidth="300px"
      maxWidth="300px"
      borderRadius="8px"
      border={`1px solid ${theme.palette.Neutral[400]}`}
      bgcolor={theme.palette.Neutral[100]}
      sx={{
        textDecoration: "none",
        color: "inherit",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderRadius: "8px",
          border: "1px solid #000",
          bgcolor: theme.palette.Neutral[200],
          boxShadow: "-2px 2px 12px 1px rgba(0, 0, 0, 0.18)",
        },
        "&:visited": {
          color: "inherit",
        },
      }}
    >
      <CardMedia
        component="img"
        image={module.imageURL ? module.imageURL : BlankImg}
        alt={module.title}
        sx={{ aspectRatio: "16 / 9" }}
      />
      <Stack
        padding="4px 0 16px 0"
        flexDirection="column"
        alignItems="flex-start"
        gap="8px"
        alignSelf="stretch"
      >
        <Typography variant="labelLarge">
          Module {module.displayIndex}
        </Typography>
        <Typography variant="bodyLarge">{module.title}</Typography>
      </Stack>
      <Button
        startIcon={<ModeCommentOutlined />}
        sx={{
          width: "100%",
          padding: "10px 24px 10px 16px",
          color: theme.palette.Facilitator.Dark.Default,

          borderRadius: "4px",
          border: `1px solid ${theme.palette.Neutral[500]}`,
        }}
        onClick={handleFeedbackClick}
        href={viewFeedbackUrl}
      >
        <Typography variant="labelLarge">View Feedback</Typography>
      </Button>
    </Stack>
  );
};

export default ModuleCardFacilitator;
