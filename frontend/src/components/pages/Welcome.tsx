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
import { Redirect } from "react-router-dom";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";

import background from "../assets/backgroundImage.png";
import icon from "../assets/icon.png";
import LoginComponent from "../auth/LoginComponent";
import { Role } from "../../types/AuthTypes";
import { administrator, facilitator, learner } from "../../theme/palette";

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

  enum PaletteRole {
    Administrator = "administrator",
    Facilitator = "facilitator",
    Learner = "learner",
  }

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
          <div
            style={{
              fontSize: "18px",
              fontWeight: 400,
              color: "black",
              lineHeight: "25.2px",
              letterSpacing: "0.4px",
              fontFamily: "Lexend Deca, sans-serif",
            }}
          >
            {buttonText}
          </div>
          <ArrowForwardIcon sx={{ color: "black" }} />
        </Button>
      </Container>
    );
  };

  interface InfoBoxProps {
    title: string;
    description: string;
    instruction: string;
    backgroundColor: string;
    borderColor: string;
  }
  const InfoBox: React.FC<InfoBoxProps> = ({
    title,
    description,
    instruction,
    backgroundColor,
    borderColor,
  }) => {
    return (
      <Box
        sx={{
          width: "366.67px",
          height: "281px",
          border: "1px solid",
          padding: "40px",
          backgroundColor,
          borderColor,
        }}
      >
        <Typography
          style={{
            fontSize: "26px",
            fontWeight: 600,
            color: "black",
            lineHeight: "31.2px",
            letterSpacing: "0.4px",
            fontFamily: "Lexend Deca, sans-serif",
          }}
          sx={{ marginBottom: "16px" }}
        >
          {title}
        </Typography>

        <Typography
          style={{
            fontSize: "16px",
            fontWeight: 400,
            color: "black",
            lineHeight: "22.4px",
            letterSpacing: "0.2px",
            fontFamily: "Lexend Deca, sans-serif",
          }}
          sx={{ marginBottom: "16px" }}
        >
          {description}
        </Typography>

        <Typography
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "black",
            lineHeight: "21.6px",
            letterSpacing: "0.12px",
            fontFamily: "Lexend Deca, sans-serif",
          }}
          sx={{ marginBottom: "8px" }}
        >
          Don&apos;t have an account?
        </Typography>

        <Typography
          style={{
            fontSize: "16px",
            fontWeight: 400,
            color: "black",
            lineHeight: "22.4px",
            letterSpacing: "0.2px",
            fontFamily: "Lexend Deca, sans-serif",
          }}
        >
          {instruction}
        </Typography>
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
          padding: "0 0 0 0",
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
            padding: "0",
            backgroundColor: learner[98],
          }}
          disableGutters
        >
          {/* Container for ImageOverlay with 50% width */}
          <Container
            sx={{
              width: "calc(50% - 10px)",
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
          <CustomButton
            role={PaletteRole.Facilitator}
            buttonText="Are you a facilitator?"
          />
          <CustomButton
            role={PaletteRole.Administrator}
            buttonText="Are you an administrator?"
          />
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
          instruction="Create a new account by signing up here."
          backgroundColor={facilitator[98]}
          borderColor={theme.palette.facilitator.main}
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
          sx: { width: "50%" },
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
            width: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoginComponent
            userRole={selectedRole as Role}
            isDrawerComponent
            align="center"
          />
        </Box>
      </Drawer>
    </Container>
  );
};

export default Welcome;
