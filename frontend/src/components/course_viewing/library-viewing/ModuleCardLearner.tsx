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
  unitId,
  isSidebarOpen,
}: {
  module: CourseModule;
  unitId: string;
  isSidebarOpen: boolean;
}) => {
  const theme = useTheme();
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
              <Typography variant="labelMedium">FINISHED ON [DATE]</Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default ModuleCardLearner;
