import {
  createTheme,
  PaletteOptions,
  SimplePaletteColorOptions,
  TypographyOptions,
} from "@mui/material/styles";
import { TypographyStyleOptions } from "@mui/material/styles/createTypography";
import { error, learner, administrator, facilitator } from "./palette";
import "@fontsource/roboto";

// adding custom attributes to palette
declare module "@mui/material/styles" {
  // allow configuration using `createTheme`
  interface PaletteOptions {
    // Figma: primary colour palette
    learner: SimplePaletteColorOptions;

    // Figma: secondary colour palette
    administrator: SimplePaletteColorOptions;

    // Figma: tertiary colour palette
    facilitator: SimplePaletteColorOptions;
  }

  interface TypographyOptions {
    // Figma: typography section
    displayLarge?: TypographyStyleOptions;
    displayMedium?: TypographyStyleOptions;
    displaySmall?: TypographyStyleOptions;
    headlineLarge?: TypographyStyleOptions;
    headlineMedium?: TypographyStyleOptions;
    headlineSmall?: TypographyStyleOptions;
    titleLarge?: TypographyStyleOptions;
    titleMedium?: TypographyStyleOptions;
    titleSmall?: TypographyStyleOptions;
    labelLarge?: TypographyStyleOptions;
    labelLargeProminent?: TypographyStyleOptions;
    labelMedium?: TypographyStyleOptions;
    labelSmall?: TypographyStyleOptions;
    bodyLarge?: TypographyStyleOptions;
    bodyMedium?: TypographyStyleOptions;
    bodySmall?: TypographyStyleOptions;
  }

  interface Theme {
    palette: PaletteOptions;
    typography: TypographyOptions;
  }
}

// Button Setting
// Allows the custom color properties to be passed in <Button color = "">
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    learner: true;
    administrator: true;
    facilitator: true;
  }
}

// Typography Setting
// Allows the custom font properties to be passed in <Typography variant = "">
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    displayLarge: true;
    displayMedium: true;
    displaySmall: true;
    headlineLarge: true;
    headlineMedium: true;
    headlineSmall: true;
    titleLarge: true;
    titleMedium: true;
    titleSmall: true;
    labelLarge: true;
    labelMedium: true;
    labelSmall: true;
    bodyLarge: true;
    bodyMedium: true;
    bodySmall: true;
    labelLargeProminent: true;
  }
}

// Color Palettes
const lightThemePalette: PaletteOptions = {
  mode: "light",
  learner: {
    main: learner.default,
    light: learner[90], // container - corresponds to Figma design document
    dark: learner[10], // on container
  },
  administrator: {
    main: administrator.default,
    light: administrator[90],
    dark: administrator[10],
  },
  facilitator: {
    main: facilitator.default,
    light: facilitator[90],
    dark: facilitator[10],
  },
  error: {
    main: error[40],
    light: error[90],
    dark: error[10],
  },
};

const darkThemePalette: PaletteOptions = {
  mode: "dark",
  learner: {
    main: learner[80],
    light: learner[30],
    dark: learner[90],
  },
  administrator: {
    main: administrator[80],
    light: administrator[30],
    dark: administrator[90],
  },
  facilitator: {
    main: facilitator[80],
    light: facilitator[30],
    dark: facilitator[90],
  },
  error: {
    main: error[80],
    light: error[30],
    dark: error[90],
  },
};

const typography: TypographyOptions = {
  displayLarge: {
    fontSize: "57pt",
    fontWeight: 700,
    lineHeight: "64pt",
    letterSpacing: "-0.25pt",
  },
  displayMedium: {
    fontSize: "45pt",
    fontWeight: 700,
    lineHeight: "52pt",
    letterSpacing: "0pt",
  },
  displaySmall: {
    fontSize: "36pt",
    fontWeight: 700,
    lineHeight: "44pt",
    letterSpacing: "0pt",
  },
  headlineLarge: {
    fontSize: "28px",
    fontWeight: 600,
    lineHeight: "33.6px",
    fontFamily: "Lexend Deca, sans-serif",
    textTransform: "none",
    fontStyle: "normal",
  },
  headlineMedium: {
    fontSize: "26px",
    fontWeight: 600,
    lineHeight: "31.2px",
    textTransform: "none",
    fontFamily: "Lexend Deca, sans-serif",
  },
  headlineSmall: {
    fontSize: "22px",
    fontWeight: 600,
    lineHeight: "26.4px",
    letterSpacing: "0.4px",
    fontFamily: "Lexend Deca, sans-serif",
    textTransform: "none",
    fontStyle: "normal",
  },
  titleLarge: {
    fontSize: "22pt",
    fontWeight: 600,
    lineHeight: "28pt",
    letterSpacing: "0pt",
  },
  titleMedium: {
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "21.6px",
    letterSpacing: "0.12px",
    fontFamily: "Lexend Deca, sans-serif",
  },
  titleSmall: {
    fontSize: "24pt",
    fontWeight: 600,
    lineHeight: "20pt",
    letterSpacing: "+0.1pt",
  },
  labelLargeProminent: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "19.2px",
    letterSpacing: "0.08px",
    fontFamily: "Lexend Deca, sans-serif",
    textTransform: "none",
    fontStyle: "normal",
  },
  labelLarge: {
    fontSize: "14pt",
    fontWeight: 300,
    lineHeight: "20pt",
    letterSpacing: "+0.1pt",
    textTransform: "uppercase",
  },
  labelMedium: {
    fontSize: "12pt",
    fontWeight: 300,
    lineHeight: "16pt",
    letterSpacing: "+0.5pt",
    textTransform: "uppercase",
  },
  labelSmall: {
    fontSize: "12.5px",
    fontWeight: 300,
    letterSpacing: "5%",
    fontFamily: "Lexend Deca, sans-serif",
    fontStyle: "normal",
    textTransform: "uppercase",
  },
  bodyLarge: {
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "25.2px",
    letterSpacing: "0.4px",
    fontFamily: "Lexend Deca, sans-serif",
  },
  bodyMedium: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "22.4px",
    letterSpacing: "0.2px",
    fontFamily: "Lexend Deca, sans-serif",
  },
  bodySmall: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "19.6px",
    letterSpacing: "0.4px",
    fontFamily: "Lexend Deca, sans-serif",
    textTransform: "none",
    fontStyle: "normal",
  },
};
export enum PaletteRole {
  Administrator = "administrator",
  Facilitator = "facilitator",
  Learner = "learner",
}
const getTheme = (darkMode: boolean) => {
  const theme = createTheme({
    typography: {
      fontFamily: "Roboto, sans-serif",
      ...typography,
    },
    palette: darkMode ? { ...darkThemePalette } : { ...lightThemePalette },
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
