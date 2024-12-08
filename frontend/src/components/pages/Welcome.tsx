import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Drawer,
  IconButton,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import background from "../assets/backgroundImage.png";
import logo from "../assets/logoWhite.png";
import Login from "../auth/Login";
import { Role } from "../../types/AuthTypes";

export const getSignUpPrompt = (role: Role): string | undefined => {
  if (role === "Administrator") {
    return "Don't have an account?";
  }

  if (role === "Facilitator") {
    return "Sign up as a facilitator";
  }

  return undefined;
};

export const getSignUpPath = (role: string): string => {
  return role === "Facilitator" ? SIGNUP_PAGE : "";
};

const Welcome = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("Learner");
  const theme = useTheme();
  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  const handleButtonClick = (role: Role) => {
    setSelectedRole(role);
    setDrawerOpen(true);
  };

  interface CustomButtonProps {
    userRole: Role;
    buttonText: string;
  }

  const CustomButton: React.FC<CustomButtonProps> = ({
    userRole,
    buttonText,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <Button
          disableRipple
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: theme.palette[userRole].Hover,
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
            padding: "32px",
            textTransform: "none",
            borderRadius: "0",
            "&:hover": {
              bgcolor: theme.palette[userRole].Hover,
            },
          }}
          onClick={() => handleButtonClick(userRole)}
        >
          <Typography
            variant="bodyLarge"
            style={{
              color: theme.palette[userRole].Pressed,
            }}
          >
            {buttonText}
          </Typography>
          <ArrowForwardIcon sx={{ color: theme.palette[userRole].Pressed }} />
        </Button>
      </Box>
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
          borderRadius: "8px",
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
          borderRadius: "8px",
        }}
      >
        <Box>
          <Typography
            variant="headlineMedium"
            style={{
              color: neutral[700],
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <Typography variant="bodyMedium" style={{ color: neutral[700] }}>
            {description}
          </Typography>
        </Box>
        <Box>
          <Typography variant="titleMedium" style={{ color: neutral[700] }}>
            Don&apos;t have an account?
          </Typography>
        </Box>
        {instruction && (
          <Box>
            <Typography variant="bodyMedium" sx={{ color: neutral[700] }}>
              {instruction}
            </Typography>
          </Box>
        )}
        {signUpRedirect && (
          <Box>
            <Typography variant="bodyMedium" sx={{ color: neutral[700] }}>
              Create a new account by signing up{" "}
            </Typography>
            <Link href={SIGNUP_PAGE} color="inherit">
              <Typography variant="bodyMedium">here</Typography>
            </Link>
            <Typography variant="bodyMedium" sx={{ color: neutral[700] }}>
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
          borderRadius: "0",
          boxShadow: "none",
        }}
      >
        <CardMedia
          component="img"
          height="100%"
          image={backgroundImage}
          alt={title}
          sx={{
            borderBottomLeftRadius: "8px",
            borderTopLeftRadius: "8px",
          }}
        />
        <Box
          style={{
            position: "absolute",
            color: "#fff",
            bottom: "40px",
            left: "40px",
          }}
        >
          <img
            src={iconImage}
            alt="icon"
            style={{ paddingBottom: "10px", width: "100px" }}
          />
          <Typography variant="displayMedium" component="div" maxWidth="300px">
            {title}
          </Typography>
        </Box>
      </Card>
    );
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRole("Learner");
  };

  return (
    <Container
      style={{
        maxWidth: "100vw",
        minWidth: "1136px",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "left",
        padding: "120px 120px 0 120px",
        margin: "0 auto",
      }}
      disableGutters
      role="main"
    >
      <Box
        sx={{
          width: "100%",
          maxHeight: "749px",
          flexDirection: "column",
          justifyContent: "center",
        }}
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
            backgroundColor: theme.palette.Learner.Light,
          }}
          disableGutters
        >
          {/* Image Overlay */}
          <Box
            sx={{
              width: "calc(50%)",
              height: "640px",
              display: "flex",
            }}
          >
            <ImageOverlay
              backgroundImage={background}
              iconImage={logo}
              title="Smart Saving, Smart Spending"
            />
          </Box>

          {/* Login Component */}
          <Box
            sx={{
              width: "calc(50% - 10px)",
              height: "640px",
              display: "flex",
            }}
          >
            <Login userRole="Learner" isDrawerComponent={false} />
          </Box>
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
          <Box style={{ width: "50%" }}>
            <CustomButton
              userRole="Facilitator"
              buttonText="Are you a facilitator?"
            />
          </Box>
          <Box style={{ width: "50%" }}>
            <CustomButton
              userRole="Administrator"
              buttonText="Are you an administrator?"
            />
          </Box>
        </Container>
      </Box>

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
          backgroundColor={theme.palette.Learner.Light}
          borderColor={theme.palette.Learner.Default}
        />
        <InfoBox
          title="Facilitators"
          description="The person who is helping people learn about money."
          backgroundColor={`${theme.palette.Facilitator.Light}50`}
          borderColor={theme.palette.Facilitator.Default}
          signUpRedirect
        />
        <InfoBox
          title="Administrator"
          description="The person who monitors the program."
          instruction="Ask an existing administrator to help setup your account."
          backgroundColor={`${theme.palette.Administrator.Light}50`}
          borderColor={theme.palette.Administrator.Default}
        />
      </Container>

      <Drawer
        PaperProps={{
          sx: { maxWidth: "560px", width: "100%" },
        }}
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        style={{
          position: "relative",
        }}
      >
        <IconButton
          onClick={closeDrawer}
          style={{
            position: "absolute",
            right: 56,
            top: 56,
          }}
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
            <Login
              userRole={selectedRole}
              isDrawerComponent
              signUpPrompt={getSignUpPrompt(selectedRole)}
              signUpPath={getSignUpPath(selectedRole)}
            />
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default Welcome;
