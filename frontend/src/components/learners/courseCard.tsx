import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import BlankImg from "../assets/blankSlide.png";
import * as Routes from "../../constants/Routes";
import { CourseModule } from "../../types/CourseTypes";

interface CourseCardProps {
  module?: CourseModule;
  unitId?: string;
  size?: "small" | "large";
  progress?: number;
}

const defaultModule: CourseModule = {
  id: "demo-module",
  title: "Sample Module Title",
  displayIndex: 1,
  imageURL: BlankImg,
  pages: [],
};

export default function CourseCard({
  module = defaultModule,
  unitId = "demo-unit",
  size = "small",
  progress = 0,
}: CourseCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        maxWidth: size === "small" ? 320 : 1044,
        height: size === "small" ? 288 : 580,
        display: "flex",
        flexDirection: "column",
        border: "none",
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      <CardActionArea
        disableRipple
        component={Link}
        to={`${Routes.VIEW_PAGE}?unitId=${unitId}&moduleId=${module.id}`}
        sx={{
          borderRadius: size === "small" ? "8px" : "16px",
          backgroundColor: "transparent",
          "&:hover, &:active, &.Mui-focusVisible": {
            backgroundColor: "transparent",
          },
          "& .MuiTouchRipple-root": {
            display: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: "inherit",
            border: `1px solid ${theme.palette.Neutral[300]}`,
            overflow: "hidden",

            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundColor: "#000",
              opacity: 0,
              pointerEvents: "none",
              zIndex: "3",
              top: -1,
              left: -1,
              right: -1,
            },

            ".MuiCardActionArea-root:hover &::after": {
              opacity: 0.05,
            },

            ".MuiCardActionArea-root:active &::after": {
              opacity: 0.1,
            },

            ".MuiCardActionArea-root.Mui-focusVisible &": {
              outline: `4.5px solid ${theme.palette.Learner.Dark.Default}`,
              outlineOffset: "2px",
            },
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: "absolute",
              top: -1,
              left: -1,
              right: -1,
              height: size === "small" ? 7 : 17,
              zIndex: 2, // above image, under overlay
              borderRadius: size === "small" ? "8px 8px 0 0" : "16px 16px 0 0",
              backgroundColor: theme.palette.Learner.Light.Selected,
              "& .MuiLinearProgress-bar": {
                backgroundColor: theme.palette.Learner.Dark.Default,
              },
            }}
          />
          <CardMedia
            sx={{
              zIndex: 1,
              position: "relative",
              aspectRatio: "16 / 9",
              overflow: "hidden",
              backgroundColor: theme.palette.Learner.Light.Default,
            }}
          >
            <img
              src={module.imageURL ?? BlankImg}
              alt={module.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </CardMedia>
        </Box>
      </CardActionArea>

      {size === "small" && (
        <CardContent
          sx={{
            padding: "12px 0px 0px 0px",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="labelLarge"
            sx={{
              color: theme.palette.Neutral[500],
              paddingBottom: "8px",
            }}
          >
            Module {module.displayIndex}
          </Typography>

          <Typography
            variant="bodyLarge"
            sx={{
              color: theme.palette.Neutral[700],
              overflowWrap: "break-word",
              flexGrow: 1,
              display: "block",
              paddingBottom: "8px",
            }}
          >
            {module.title}
          </Typography>

          <Card
            elevation={0}
            sx={{
              height: "25px",
              width: "130px",
              backgroundColor: theme.palette.Warning.Light.Hover,
            }}
          >
            <CardContent sx={{ padding: "0px" }}>
              <Typography
                variant="labelMedium"
                sx={{
                  color: theme.palette.Warning.Dark.Default,
                  textAlign: "center",
                }}
              >
                {progress}% complete
              </Typography>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}
