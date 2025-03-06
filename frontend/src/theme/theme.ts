import {
  createTheme,
  PaletteOptions,
  TypographyOptions,
} from "@mui/material/styles";
import "@fontsource/lexend-deca";

const palette: PaletteOptions = {
  Learner: {
    Light: "#F5FDFF",
    Hover: "#CCF5FF",
    Default: "#006877",
    Pressed: "#00363F",
  },
  Administrator: {
    Light: "#FFF8F6",
    Hover: "#FFD9CC",
    Default: "#8F4C34",
    Pressed: "#5C1900",
  },
  Facilitator: {
    Light: "#F9F5FF",
    Hover: "#D6D6FF",
    Default: "#555A92",
    Pressed: "#1F257A",
  },
  Error: {
    Light: "#FFF2F0",
    Hover: "#FFD1CC",
    Default: "#BA1A1A",
    Pressed: "#690005",
  },
  Success: {
    Light: "#FDFFF0",
    Hover: "#FAFFCC",
    Default: "#687021",
    Pressed: "#444B04",
  },
  Warning: {
    Light: "#FFFBEF",
    Hover: "#FFF2CC",
    Default: "#775900",
    Pressed: "#3F2F00",
  },
  Neutral: {
    100: "#FFFFFF",
    200: "#F8FAFA",
    300: "#E4E5E5",
    400: "#CACCCC",
    500: "#6F797B",
    600: "#404B4D",
    700: "#111111",
  },
  Light: {
    OnSurfaceVariant: "#3F484B",
    Outline: "#6F797B",
  },
};

const typography: TypographyOptions = {
  displayLarge: {
    fontSize: "46px",
    fontWeight: 700,
    lineHeight: "110%",
    letterSpacing: "-0.2px",
    textTransform: "none",
  },
  displayMedium: {
    fontSize: "36px",
    fontWeight: 700,
    lineHeight: "110%",
    textTransform: "none",
  },
  displaySmall: {
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: "110%",
    textTransform: "none",
  },
  headlineLarge: {
    fontSize: "28px",
    fontWeight: 600,
    lineHeight: "120%",
    textTransform: "none",
  },
  headlineMedium: {
    fontSize: "26px",
    fontWeight: 600,
    lineHeight: "120%",
    textTransform: "none",
  },
  headlineSmall: {
    fontSize: "22px",
    fontWeight: 600,
    lineHeight: "120%",
    textTransform: "none",
  },
  titleLarge: {
    fontSize: "24px",
    fontWeight: 600,
    lineHeight: "120%",
    textTransform: "none",
  },
  titleMedium: {
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "120%",
    letterSpacing: "0.12px",
    textTransform: "none",
  },
  titleSmall: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "120%",
    letterSpacing: "0.08px",
    textTransform: "none",
  },
  bodyLarge: {
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "140%",
    letterSpacing: "0.4px",
    textTransform: "none",
  },
  bodyMedium: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "140%",
    letterSpacing: "0.2px",
    textTransform: "none",
  },
  bodySmall: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "140%",
    letterSpacing: "0.32px",
    textTransform: "none",
  },
  labelLargeProminent: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "120%",
    letterSpacing: "0.08px",
    textTransform: "none",
  },
  labelLarge: {
    fontSize: "14px",
    fontWeight: 300,
    lineHeight: "120%",
    letterSpacing: "0.7px",
    textTransform: "uppercase",
  },
  labelMediumProminent: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "120%",
    letterSpacing: "0.4px",
    textTransform: "none",
  },
  labelMedium: {
    fontSize: "14px",
    fontWeight: 300,
    lineHeight: "120%",
    letterSpacing: "0.7px",
    textTransform: "uppercase",
  },
  labelSmall: {
    fontSize: "12.5px",
    fontWeight: 300,
    lineHeight: "120%",
    letterSpacing: "0.625px",
    textTransform: "uppercase",
  },
};

const getTheme = () => {
  const theme = createTheme({
    typography: {
      fontFamily: "Lexend Deca, sans-serif",
      ...typography,
    },
    palette,
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: typography.bodySmall,
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: typography.bodyMedium,
        },
      },
    },
  });
  return theme;
};

export default getTheme;
