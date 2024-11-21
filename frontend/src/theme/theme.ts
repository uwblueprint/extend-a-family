import {
  createTheme,
  PaletteOptions,
  SimplePaletteColorOptions,
  TypographyOptions,
} from "@mui/material/styles";
import { TypographyStyleOptions } from "@mui/material/styles/createTypography";
import { error, learner, administrator, facilitator, neutral } from "./palette";
import "@fontsource/lexend-deca";

interface CustomPaletteColorOptions extends SimplePaletteColorOptions {
  light: string;
  dark: string;
}

// adding custom attributes to palette
declare module "@mui/material/styles" {
  // allow configuration using `createTheme`
  interface PaletteOptions {
    // Figma: primary colour palette
    learner: CustomPaletteColorOptions;

    // Figma: secondary colour palette
    administrator: CustomPaletteColorOptions;

    // Figma: tertiary colour palette
    facilitator: CustomPaletteColorOptions;

    neutral: CustomPaletteColorOptions;
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
    main: learner[40],
    light: learner[98], // container - corresponds to Figma design document
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

  neutral: {
    main: neutral[40],
    light: neutral[98],
    dark: neutral[10],
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
  neutral: {
    main: neutral[60],
    light: neutral[10],
    dark: neutral[90], // change these later
  },
};

const typography: TypographyOptions = {
  displayLarge: {
    fontSize: "57px",
    fontWeight: 700,
    lineHeight: "64px",
    letterSpacing: "-0.25px",
  },
  displayMedium: {
    fontSize: "45px",
    fontWeight: 700,
    lineHeight: "52px",
    letterSpacing: "0px",
  },
  displaySmall: {
    fontSize: "36px",
    fontWeight: 700,
    lineHeight: "44px",
    letterSpacing: "0px",
  },
  headlineLarge: {
    fontSize: "32px",
    fontWeight: 600,
    lineHeight: "40px",
    letterSpacing: "0px",
  },
  headlineMedium: {
    fontSize: "28px",
    fontWeight: 600,
    lineHeight: "36px",
    letterSpacing: "0px",
  },
  headlineSmall: {
    fontSize: "24px",
    fontWeight: 600,
    lineHeight: "32px",
    letterSpacing: "0px",
  },
  titleLarge: {
    fontSize: "22px",
    fontWeight: 600,
    lineHeight: "28px",
    letterSpacing: "0px",
    textTransform: "none",
  },
  titleMedium: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "24px",
    letterSpacing: "+0.15px",
  },
  titleSmall: {
    fontSize: "24px",
    fontWeight: 600,
    lineHeight: "20px",
    letterSpacing: "+0.1px",
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
    fontSize: "14px",
    fontWeight: 300,
    lineHeight: "20px",
    letterSpacing: "+0.1px",
    textTransform: "uppercase",
  },
  labelMedium: {
    fontSize: "12px",
    fontWeight: 300,
    lineHeight: "16px",
    letterSpacing: "+0.5px",
    textTransform: "uppercase",
  },
  labelSmall: {
    fontSize: "11px",
    fontWeight: 300,
    lineHeight: "16px",
    letterSpacing: "+0.5px",
    textTransform: "uppercase",
  },
  bodyLarge: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "+0.5px",
  },
  bodyMedium: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    letterSpacing: "+0.25px",
  },
  bodySmall: {
    fontSize: "12.5px",
    fontWeight: 400,
    lineHeight: "16px",
    letterSpacing: "+0.4px",
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
      fontFamily: "Lexend Deca, sans-serif",
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
