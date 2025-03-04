import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
import BlankImg from "./BlankSlide.png";
import useCourseModules from "../../../hooks/useCourseModules";
import { CourseModule } from "../../../types/CourseTypes";

interface ModuleGridProps {
  unitId: string;
  isSidebarOpen: boolean;
}

export default function CourseModulesGrid({
  unitId,
  isSidebarOpen,
}: ModuleGridProps) {
  const { courseModules, loading, error } = useCourseModules(unitId);

  if (loading) return <Typography>Loading modules...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container spacing={2}>
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
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardMedia
              component="img"
              height="180"
              image={module.imageURL ? module.imageURL : BlankImg}
              alt={module.title}
            />
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Module {module.displayIndex}
              </Typography>
              <Typography
                variant="h6"
                color="textPrimary"
                sx={{
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
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
