import "@fontsource/lexend-deca";
import {
  createTheme,
  PaletteOptions,
  TypographyOptions,
} from "@mui/material/styles";

const palette: PaletteOptions = {
  Learner: {
    Light: {
      Default: "#E8FCFF",
      Hover: "#CCF8FF",
      Selected: "#AFF0FA",
      Pressed: "#90E3F0",
    },
    Dark: {
      Default: "#006C7D",
      Hover: "#004D59",
      Selected: "#003942",
      Pressed: "#002E36",
    },
  },
  Administrator: {
    Light: {
      Default: "#FFE6DD",
      Hover: "#FCC4B1",
      Selected: "#FFD9CC",
      Pressed: "#FCC4B1",
    },
    Dark: {
      Default: "#8F4C34",
      Hover: "#663625",
      Selected: "#4D281C",
      Pressed: "#3C2016",
    },
  },
  Facilitator: {
    Light: {
      Default: "#F2F3FF",
      Hover: "#E5E7FF",
      Selected: "#D9DBFF",
      Pressed: "#CACDFC",
    },
    Dark: {
      Default: "#4F549E",
      Hover: "#32377D",
      Selected: "#1F2469",
      Pressed: "#191D54",
    },
  },
  Neutral: {
    100: "#FFFFFF",
    200: "#F2F2F2",
    300: "#D1D2D4",
    400: "#B2B3B5",
    500: "#919295",
    600: "#7A7C7F",
    700: "#555759",
    800: "#4A4C4D",
    900: "#111111",
  },
  Success: {
    Light: {
      Default: "#FAFFEF",
      Hover: "#EAFAC8",
      Selected: "#E0F7AD",
      Pressed: "#D4F291",
    },
    Dark: {
      Default: "#486902",
      Hover: "#385200",
      Selected: "#2A3D00",
      Pressed: "#213000",
    },
  },
  Error: {
    Light: {
      Default: "#FFEFEF",
      Hover: "#FFE0E0",
      Selected: "#FFD4D4",
      Pressed: "#FFBDBD",
    },
    Dark: {
      Default: "#AD2323",
      Hover: "#801313",
      Selected: "#610A0A",
      Pressed: "#540000",
    },
  },
  Warning: {
    Light: {
      Default: "#FFF5E0",
      Hover: "#FFEABF",
      Selected: "#FFDD99",
      Pressed: "#FFCC66",
    },
    Dark: {
      Default: "#693902",
      Hover: "#522C00",
      Selected: "#3D2100",
      Pressed: "#301A00",
    },
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
