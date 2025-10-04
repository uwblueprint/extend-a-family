import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColorOptions {
    Light: string;
    Hover: string;
    Default: string;
    Pressed: string;
  }

  interface NewPaletteColorOptions {
    Default: string;
    Selected: string;
    Pressed: string;
    Hover: string;
  }

  interface UserShadeColorOptions {
    Default: string;
    Hover: string;
    Selected: string;
    Pressed: string;
  }

  interface UserColorOptions {
    Light: UserShadeColorOptions;
    Dark: UserShadeColorOptions;
  }

  interface PaletteOptions {
    Learner: UserColorOptions;
    Administrator: UserColorOptions;
    Facilitator: UserColorOptions;
    Neutral: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    Success: UserColorOptions;
    Error: UserColorOptions;
    Warning: UserColorOptions;
  }

  interface TypographyOptions {
    displayLarge?: TypographyStyleOptions;
    displayMedium?: TypographyStyleOptions;
    displaySmall?: TypographyStyleOptions;
    headlineLarge?: TypographyStyleOptions;
    headlineMedium?: TypographyStyleOptions;
    headlineSmall?: TypographyStyleOptions;
    titleLarge?: TypographyStyleOptions;
    titleMedium?: TypographyStyleOptions;
    titleSmall?: TypographyStyleOptions;
    labelLargeProminent?: TypographyStyleOptions;
    labelLarge?: TypographyStyleOptions;
    labelMediumProminent?: TypographyStyleOptions;
    labelMedium?: TypographyStyleOptions;
    labelSmall?: TypographyStyleOptions;
    bodyLarge?: TypographyStyleOptions;
    bodyMedium?: TypographyStyleOptions;
    bodySmall?: TypographyStyleOptions;
  }

  interface Theme {
    palette: PaletteOptions;
    typography: TypographyStyleOptions;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    Learner: true;
    Administrator: true;
    Facilitator: true;
    Error: true;
    Success: true;
    Warning: true;
    Neutral: true;
  }
}

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
    labelLargeProminent: true;
    labelLarge: true;
    labelMediumProminent: true;
    labelMedium: true;
    labelSmall: true;
    bodyLarge: true;
    bodyMedium: true;
    bodySmall: true;
  }
}
