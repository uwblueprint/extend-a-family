import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Drawer,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";

import background from "../assets/backgroundImage.png";
import icon from "../assets/icon.png";
import LoginComponent from "../auth/LoginComponent";
import { Role } from "../../types/AuthTypes";
import { administrator, facilitator, learner } from "../../theme/palette";
import { PaletteRole } from "../../theme/theme";

const Welcome = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const theme = useTheme();
  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  const handleButtonClick = (role: string) => {
    setSelectedRole(role);
    setDrawerOpen(true);
  };

  const getSignUpPrompt = (role: string): string | undefined => {
    if (role === "administrator") {
      return "Don't have an account?";
    }

    if (role === "facilitator") {
      return "Sign up as facilitator";
    }

    return undefined;
  };

  const getSignUpPath = (role: string): unknown | undefined => {
    if (role === "administrator") {
      return undefined;
    }

    if (role === "facilitator") {
      return {
        pathname: SIGNUP_PAGE,
        search: `?role=facilitator`,
      };
    }

    return undefined;
  };

  interface CustomButtonProps {
    role: PaletteRole;
    buttonText: string;
  }

  const CustomButton: React.FC<CustomButtonProps> = ({ role, buttonText }) => {
    return (
      <Container
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
        disableGutters
      >
        <Button
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: theme.palette[role].light,
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            padding: "32px",
            textTransform: "none",
          }}
          onClick={() => handleButtonClick(role)}
        >
          <Typography
            variant="bodyLarge"
            style={{
              color: "black",
            }}
          >
            {buttonText}
          </Typography>
          <ArrowForwardIcon sx={{ color: "black" }} />
        </Button>
      </Container>
    );
  };

  interface InfoBoxProps {
    title: string;
    description: string;
    backgroundColor: string;
    borderColor: string;
    instruction?: string;
    signUpRedirect?: boolean;
  }
  const InfoBox: React.FC<InfoBoxProps> = ({
    title,
    description,
    instruction,
    backgroundColor,
    borderColor,
    signUpRedirect,
  }) => {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "386.67px",
          maxHeight: "100%",
          height: "auto",
          border: "1px solid",
          padding: "40px",
          gap: "20px",
          justifyContent: "space-between",
          backgroundColor,
          borderColor,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "auto",
        }}
      >
        <Box>
          <Typography
            variant="headlineMedium"
            style={{
              color: "black",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <Typography variant="bodyMedium" style={{ color: "black" }}>
            {description}
          </Typography>
        </Box>
        <Box>
          <Typography variant="titleMedium" style={{ color: "black" }}>
            Don&apos;t have an account?
          </Typography>
        </Box>
        {instruction && (
          <Box>
            <Typography variant="bodyMedium" sx={{ color: "black" }}>
              {instruction}
            </Typography>
          </Box>
        )}
        {signUpRedirect && (
          <Box>
            <Typography variant="bodyMedium" sx={{ color: "black" }}>
              Create a new account by signing up{" "}
            </Typography>
            <Link
              to={{
                pathname: SIGNUP_PAGE,
                search: `?role=facilitator`,
              }}
            >
              <Typography variant="bodyMedium">here</Typography>
            </Link>
            <Typography variant="bodyMedium" sx={{ color: "black" }}>
              .
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  interface ImageOverlayProps {
    backgroundImage: string;
    iconImage: string;
    title: string;
  }
  const ImageOverlay: React.FC<ImageOverlayProps> = ({
    backgroundImage,
    iconImage,
    title,
  }) => {
    return (
      <Card
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          textAlign: "left",
        }}
      >
        <CardMedia
          component="img"
          height="100%"
          image={backgroundImage}
          alt={title}
        />
        <Box
          style={{
            position: "absolute",
            color: "#fff",
            top: "68.75%",
            left: "6.25%",
          }}
        >
          <img
            src={iconImage}
            alt="icon"
            style={{ paddingBottom: "10px", width: "100px" }}
          />
          <Typography
            style={{
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: "39.6px",
              letterSpacing: "0.4px",
              fontFamily: "Lexend Deca, sans-serif",
              color: "white",
            }}
            component="div"
          >
            {title}
          </Typography>
        </Box>
      </Card>
    );
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRole("");
  };

  return (
    <Container
      style={{
        minWidth: "1136px",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "left",
        padding: "120px 120px 0 120px",
      }}
    >
      <Container
        sx={{
          width: "100%",
          maxHeight: "749px",
          flexDirection: "column",
          justifyContent: "center",
        }}
        disableGutters
      >
        {/* Splash and Login */}
        <Container
          style={{
            height: "640px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",
            backgroundColor: learner[98],
          }}
          disableGutters
        >
          {/* Container for ImageOverlay with 50% width */}
          <Container
            sx={{
              width: "calc(50%)",
              height: "640px",
              display: "flex",
            }}
            disableGutters
          >
            <ImageOverlay
              backgroundImage={background}
              iconImage={icon}
              title="Smart Saving, Smart Spending"
            />
          </Container>

          {/* Container for LoginComponent with 50% width */}
          <Container
            sx={{
              width: "calc(50% - 10px)",
              height: "640px",
              display: "flex",
            }}
            disableGutters
          >
            <LoginComponent
              userRole={"Learner" as Role}
              isDrawerComponent={false}
            />
          </Container>
        </Container>

        {/* Buttons */}
        <Container
          style={{
            width: "100%",
            maxHeight: "89px",
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
          className="button-container"
          disableGutters
        >
          <Container style={{ width: "50%" }} disableGutters>
            <CustomButton
              role={PaletteRole.Facilitator}
              buttonText="Are you a facilitator?"
            />
          </Container>
          <Container style={{ width: "50%" }} disableGutters>
            <CustomButton
              role={PaletteRole.Administrator}
              buttonText="Are you an administrator?"
            />
          </Container>
        </Container>
      </Container>

      <Container
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "40px",
          width: "100%",
          padding: "80px 0 120px 0",
        }}
        className="info-box-container"
      >
        <InfoBox
          title="Learners"
          description="The person who is learning about money."
          instruction="Ask a facilitator to setup your account."
          backgroundColor={learner[98]}
          borderColor={theme.palette.learner.main}
        />
        <InfoBox
          title="Facilitators"
          description="The person who is helping people learn about money."
          backgroundColor={facilitator[98]}
          borderColor={theme.palette.facilitator.main}
          signUpRedirect
        />
        <InfoBox
          title="Administrator"
          description="The person who monitors the program."
          instruction="Ask an existing administrator to help setup your account."
          backgroundColor={administrator[98]}
          borderColor={theme.palette.administrator.main}
        />
      </Container>

      <Drawer
        PaperProps={{
          sx: { maxWidth: "560px", width: "100%" },
        }}
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
      >
        <IconButton
          onClick={closeDrawer}
          style={{ position: "absolute", right: 0 }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {drawerOpen && (
            <LoginComponent
              userRole={selectedRole as Role}
              isDrawerComponent
              signUpPrompt={getSignUpPrompt(selectedRole)}
              signUpPath={getSignUpPath(selectedRole) as string}
            />
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default Welcome;
