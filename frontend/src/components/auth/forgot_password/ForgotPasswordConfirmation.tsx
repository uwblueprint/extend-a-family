import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  useTheme,
  Snackbar,
  Box,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import authAPIClient from "../../../APIClients/AuthAPIClient";

interface ForgotPasswordConfirmationProps {
  email: string;
  onBackToEmail: () => void;
}

const ForgotPasswordConfirmation: React.FC<ForgotPasswordConfirmationProps> = ({
  email,
  onBackToEmail,
}) => {
  const theme = useTheme();
  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }

    setCanResend(true);
    return undefined;
  }, [seconds]);

  const handleResendEmail = async () => {
    if (canResend) {
      setSeconds(30);
      setCanResend(false);
      try {
        await authAPIClient.resetPassword(email);
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 5000);
      } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error("Error resending email:", error);
      }
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.background?.default,
      }}
    >
      <Container
        sx={{
          display: "flex",
          width: "500px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "20px",
          flexShrink: 0,
          backgroundColor: theme.palette.background?.paper,
          padding: theme.spacing(3),
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: theme.spacing(1),
            alignSelf: "stretch",
            marginLeft: theme.spacing(-3),
          }}
        >
          <Typography
            variant="headlineLarge"
            gutterBottom
            sx={{ marginBottom: 0 }}
          >
            Email sent
          </Typography>
          <Typography variant="bodyMedium">
            Check your email ({email}) and open the link we sent to continue.
          </Typography>
        </Container>
        <Button variant="text" sx={{ padding: 0 }}>
          <Typography
            variant="labelSmall"
            onClick={onBackToEmail}
            sx={{
              color: theme.palette.Learner.Default,
              padding: 0,
            }}
          >
            NOT YOUR EMAIL? Go back to change your email
          </Typography>
        </Button>
        {canResend ? (
          <Button variant="text" sx={{ padding: 0 }}>
            <Typography
              variant="labelSmall"
              onClick={handleResendEmail}
              sx={{
                color: canResend
                  ? theme.palette.Learner.Default
                  : theme.palette.text?.disabled,
                padding: 0,
              }}
            >
              Didn’t get the email? Send it again now.
            </Typography>
          </Button>
        ) : (
          <Typography
            variant="labelSmall"
            onClick={handleResendEmail}
            sx={{
              color: canResend
                ? theme.palette.Learner.Default
                : theme.palette.text?.disabled,
              padding: 0,
            }}
          >
            Didn’t get the email? You can request a new one in {seconds}s.
          </Typography>
        )}
      </Container>
      <Snackbar
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        autoHideDuration={5000}
        sx={{
          display: "inline-flex",
          maxWidth: "500px",
          width: "100%",
        }}
        ContentProps={{
          sx: {
            display: "inline-flex",
            padding: "20px 32px",
            alignItems: "center",
            gap: "16px",
            borderRadius: "8px",
            backgroundColor: "#EDF2BD !important",
            color: theme.palette.text?.primary,
            fontSize: theme.typography.bodyMedium?.fontSize,
            fontWeight: 400,
            lineHeight: "1.5",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "#EDF2BD",
            padding: "20px 32px",
            borderRadius: "var(--Radius-200, 8px)",
          }}
        >
          <SendIcon
            sx={{
              color: theme.palette.Success.Default,
              marginRight: "16px",
            }}
          />
          <Typography sx={{ color: theme.palette.Success.Default }}>
            {`A new reset email has been sent. 
            Please check your inbox (and spam folder).`}
          </Typography>
        </Box>
      </Snackbar>
    </Container>
  );
};

export default ForgotPasswordConfirmation;
