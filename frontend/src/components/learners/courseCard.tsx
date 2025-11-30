import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
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
      }}
    >
      <CardActionArea
        component={Link}
        to={`${Routes.VIEW_PAGE}?unitId=${unitId}&moduleId=${module.id}`}
        sx={{ borderRadius: "8px" }}
      >
        <CardMedia
          component="img"
          image={module.imageURL ? module.imageURL : BlankImg}
          alt={module.title}
          sx={{
            border: `1px solid ${theme.palette.Neutral[300]}`,
            borderRadius: "8px",
            aspectRatio: "16 / 9",
          }}
        />

        <CardContent
          sx={{
            padding: "12px 0px 0px 0px",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            "&:last-child": {
              paddingBottom: 0,
            },
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
              minHeight: "24px",
              lineHeight: "24px",
              overflowWrap: "break-word",
              flexGrow: 1,
              display: "block",
            }}
          >
            {module.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
