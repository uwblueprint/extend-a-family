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
  }
}

// Color Palettes
const lightThemePalette: PaletteOptions = {
  mode: "light",
  learner: {
    main: learner[40],
    light: learner[90], // container - corresponds to Figma design document
    dark: learner[10], // on container
  },
  administrator: {
    main: administrator[40],
    light: administrator[90],
    dark: administrator[10],
  },
  facilitator: {
    main: facilitator[40],
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
    fontSize: "32pt",
    fontWeight: 600,
    lineHeight: "40pt",
    letterSpacing: "0pt",
  },
  headlineMedium: {
    fontSize: "28pt",
    fontWeight: 600,
    lineHeight: "36pt",
    letterSpacing: "0pt",
  },
  headlineSmall: {
    fontSize: "24pt",
    fontWeight: 600,
    lineHeight: "32pt",
    letterSpacing: "0pt",
  },
  titleLarge: {
    fontSize: "22pt",
    fontWeight: 600,
    lineHeight: "28pt",
    letterSpacing: "0pt",
  },
  titleMedium: {
    fontSize: "16pt",
    fontWeight: 600,
    lineHeight: "24pt",
    letterSpacing: "+0.15pt",
  },
  titleSmall: {
    fontSize: "24pt",
    fontWeight: 600,
    lineHeight: "20pt",
    letterSpacing: "+0.1pt",
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
    fontSize: "11pt",
    fontWeight: 300,
    lineHeight: "16pt",
    letterSpacing: "+0.5pt",
    textTransform: "uppercase",
  },
  bodyLarge: {
    fontSize: "16pt",
    fontWeight: 400,
    lineHeight: "24pt",
    letterSpacing: "+0.5pt",
  },
  bodyMedium: {
    fontSize: "14pt",
    fontWeight: 400,
    lineHeight: "20pt",
    letterSpacing: "+0.25pt",
  },
  bodySmall: {
    fontSize: "12pt",
    fontWeight: 400,
    lineHeight: "16pt",
    letterSpacing: "+0.4pt",
  },
};

const getTheme = (darkMode: boolean) => {
  const theme = createTheme({
    typography: {
      fontFamily: "Roboto, sans-serif",
      ...typography,
    },
    palette: darkMode ? { ...darkThemePalette } : { ...lightThemePalette },
  });
  return theme;
};

export default getTheme;
