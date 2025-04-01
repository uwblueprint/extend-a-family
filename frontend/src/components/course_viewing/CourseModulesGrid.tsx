import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  CardActionArea,
} from "@mui/material";
import { Link } from "react-router-dom";
import BlankImg from "../assets/blankSlide.png";
import useCourseModules from "../../hooks/useCourseModules";
import { CourseModule } from "../../types/CourseTypes";
import * as Routes from "../../constants/Routes";

interface ModuleGridProps {
  unitId: string;
  isSidebarOpen: boolean;
}

export default function CourseModulesGrid({
  unitId,
  isSidebarOpen,
}: ModuleGridProps) {
  const { courseModules, loading, error } = useCourseModules(unitId);
  const theme = useTheme();

  if (loading)
    return <Typography paddingLeft="10px">Loading modules...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container>
      {courseModules.map((module: CourseModule) => (
        <Grid
          item
          key={module.id}
          xs={12}
          sm={6}
          md={4}
          lg={isSidebarOpen ? 4 : 3}
          xl={isSidebarOpen ? 3 : 2}
        >
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "none",
              boxShadow: "none",
            }}
          >
            <CardActionArea
              component={Link}
              to={`${Routes.VIEW_PAGE}?unitId=${unitId}&moduleId=${module.id}`}
              sx={{ padding: "12px", borderRadius: "8px" }}
            >
              <CardMedia
                component="img"
                image={module.imageURL ? module.imageURL : BlankImg}
                alt={module.title}
                sx={{
                  border: `1px solid ${theme.palette.Neutral[400]}`,
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
                    minHeight: "24px", // Minimum height for one line
                    lineHeight: "24px", // Ensure consistent line height
                    overflowWrap: "break-word", // Handle long words that might overflow
                    flexGrow: 1, // Allow title area to grow with longer titles
                    display: "block",
                  }}
                >
                  {module.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
