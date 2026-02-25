import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { CheckCircle } from "@mui/icons-material";
import * as Routes from "../../../constants/Routes";
import { CourseModule } from "../../../types/CourseTypes";
import BlankImg from "../../assets/blankSlide.png";

const ModuleCardLearner = ({
  module,
  index,
  unitId,
  isSidebarOpen,
  completionDate,
}: {
  module: CourseModule;
  index: number;
  unitId: string;
  isSidebarOpen: boolean;
  completionDate?: string | null;
}) => {
  const theme = useTheme();

  // Format completion date for display
  const formatCompletionDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
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
              gap: "8px",
            }}
          >
            <Typography
              variant="labelLarge"
              sx={{
                color: theme.palette.Neutral[500],
              }}
            >
              Module {index + 1}
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
            {completionDate && (
              <Stack
                direction="row"
                padding="4px 8px"
                justifyContent="center"
                alignItems="center"
                gap="8px"
                borderRadius="4px"
                bgcolor={theme.palette.Success.Light.Hover}
                color={theme.palette.Success.Dark.Default}
              >
                <CheckCircle sx={{ fontSize: 15 }} />
                <Typography variant="labelMedium">
                  FINISHED ON {formatCompletionDate(completionDate)}
                </Typography>
              </Stack>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default ModuleCardLearner;
