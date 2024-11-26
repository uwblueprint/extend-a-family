import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { Box, Container, Link, Typography, useTheme } from "@mui/material";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";
import { PaletteRole } from "../../theme/theme";
import LoginForm from "./LoginForm";

interface LoginProps {
  userRole: Role;
  isDrawerComponent: boolean;
  signUpPrompt?: string;
  signUpPath?: string;
}

const Login: React.FC<LoginProps> = ({
  userRole,
  isDrawerComponent,
  signUpPrompt,
  signUpPath,
}: LoginProps): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  const [showDrawerLogin, setShowDrawerLogin] = useState<boolean>(true);

  const theme = useTheme();
  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  const redirectSignUpPath = (): boolean => {
    if (signUpPath) {
      return !!signUpPrompt;
    }
    return false;
  };

  interface InfoTextProps {
    title: string;
    description: string;
  }
  const InfoText: React.FC<InfoTextProps> = ({ title, description }) => {
    return (
      <Box>
        <Box>
          <Typography variant="headlineLarge" style={{ color: "#390C00" }}>
            {title}
          </Typography>
        </Box>
        <Box marginTop="12px">
          <Typography variant="bodyMedium" style={{ color: "#390C00" }}>
            {description}
          </Typography>
        </Box>
      </Box>
    );
  };

  const DrawerComponent = () => {
    return (
      <Container
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "80px 80px 80px 80px",
          flexDirection: "column",
          justifyContent: "center",
        }}
        disableGutters
      >
        {showDrawerLogin && (
          <Box>
            <LoginForm userRole={userRole} />
            <Box
              sx={{
                width: "100%",
                height: "59px",
                marginTop: "20px",
              }}
            >
              {redirectSignUpPath() && (
                <Box sx={{ textAlign: "center" }}>
                  <Link
                    href={signUpPath as string}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="labelSmall"
                      style={{
                        color:
                          theme.palette[userRole.toLowerCase() as PaletteRole]
                            ?.main || "primary",
                        textTransform: "uppercase",
                      }}
                    >
                      {signUpPrompt}
                    </Typography>
                  </Link>
                </Box>
              )}
              {!redirectSignUpPath() && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="labelSmall"
                    style={{
                      color:
                        theme.palette[userRole.toLowerCase() as PaletteRole]
                          ?.main || "primary",
                    }}
                    onClick={() => setShowDrawerLogin(false)}
                    sx={{ cursor: "pointer" }}
                  >
                    {signUpPrompt}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
        {!showDrawerLogin && (
          <InfoText
            title="Contact an administrator"
            description="Please contact an existing administrator to set up your account."
          />
        )}
      </Container>
    );
  };

  const MainComponent = () => {
    return (
      <Container
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "40px 40px 40px 20px",
          flexDirection: "column",
          justifyContent: "center",
        }}
        disableGutters
      >
        <LoginForm userRole="Learner" />
      </Container>
    );
  };

  return (
    <Container
      sx={{
        width: "100%",
        height: "100%",
      }}
      disableGutters
    >
      {isDrawerComponent ? <DrawerComponent /> : <MainComponent />}
    </Container>
  );
};

export default Login;
