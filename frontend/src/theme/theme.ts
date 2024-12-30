import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";
import buttonStyles from "./buttonStyles";
import "@fontsource/lexend-deca";

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
      MuiButton: {
        styleOverrides: buttonStyles,
      },
    },
  });
  return theme;
};

export default getTheme;
