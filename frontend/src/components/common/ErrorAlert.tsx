import { Alert, AlertTitle, Box, Typography, useTheme } from "@mui/material";
import React, { useRef } from "react";

interface ErrorAlertProps {
  title?: string;
  message?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ title, message }) => {
  const theme = useTheme();
  const alertRef = useRef<HTMLDivElement>(null);
  return (
    <Box ref={alertRef} sx={{ width: "100%" }}>
      <Alert
        icon={false}
        severity="error"
        sx={{
          color: theme.palette.Error.Light.Default,
          width: "100%",
          height: "100%",
          borderRadius: "4px",
          border: "2px solid",
          borderColor: theme.palette.Error.Light.Hover,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          "& .MuiAlert-message": { padding: 0 },
        }}
      >
        <AlertTitle marginBottom="3px">
          <Typography
            variant="titleMedium"
            color={theme.palette.Error.Dark.Default}
          >
            {title || "Error"}
          </Typography>
        </AlertTitle>
        <Typography
          variant="bodyMedium"
          color={theme.palette.Error.Dark.Pressed}
        >
          {message || "An error has occurred."}
        </Typography>
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
