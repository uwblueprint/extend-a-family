import React, { useRef } from "react";
import { Alert, AlertTitle, Box, Typography, useTheme } from "@mui/material";

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
          color: theme.palette.Error.Light,
          width: "100%",
          height: "100%",
          borderRadius: "4px",
          border: "2px solid",
          borderColor: theme.palette.Error.Hover,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          "& .MuiAlert-message": { padding: 0 },
        }}
      >
        <AlertTitle marginBottom="3px">
          <Typography variant="titleMedium" color={theme.palette.Error.Default}>
            {title || "Error"}
          </Typography>
        </AlertTitle>
        <Typography variant="bodyMedium" color={theme.palette.Error.Pressed}>
          {message || "An error has occurred."}
        </Typography>
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
