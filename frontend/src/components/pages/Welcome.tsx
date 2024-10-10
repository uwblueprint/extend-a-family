import React, { useState }, { useContext } from "react";
import { Redirect,
  Typography,
  Container,
  Card,
  CardMedia,
  Box,
  Drawer,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import background from "./backgroundImage.jpg";
import icon from "./icon.png";
import Login from "../auth/Login";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";

const Welcome = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  if (authenticatedUser) {
    return <Redirect to={HOME_PAGE} />;
  }

  const handleButtonClick = (role: string) => {
    setSelectedRole(role);
    setDrawerOpen(true);
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
      <Card style={{ height: "100%", position: "relative", textAlign: "left" }}>
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
            top: "60%",
            left: "5%",
          }}
        >
          <img
            src={iconImage}
            alt="icon"
            style={{ paddingBottom: "10px", width: "100px" }}
          />

          <Typography variant="h3" component="div">
            {title}
          </Typography>
        </Box>
      </Card>
    );
  };

  const AdminButton = styled.button({
    backgroundColor: "#FFDBCF",
    width: "50%",
    textAlign: "left",
  });

  const FacilitatorButton = styled.button({
    backgroundColor: "#E0E0FF",
    width: "50%",
    textAlign: "left",
  });

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedRole("");
  };

  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "left",
      }}
    >
      <Container
        style={{
          height: "60%",
          display: "flex",
          alignItems: "center",
          textAlign: "left",
          padding: "0",
        }}
      >
        <Box style={{ height: "100%", flex: 1 }}>
          <ImageOverlay
            backgroundImage={background}
            iconImage={icon}
            title="Smart Saving, Smart Spending"
          />
        </Box>
        <Box style={{ height: "100%", flex: 1 }}>
          <Box
            style={{
              backgroundColor: "#F5FAFC",
              height: "100%",
              padding: "50px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Login userRole="learner" />
          </Box>
        </Box>
      </Container>
      <div
        style={{
          width: "100%",
          marginTop: "16px",
          display: "flex",
          gap: "10px",
        }}
        className="button-container"
      >
        <AdminButton
          className="btn"
          onClick={() => handleButtonClick("administrator")}
        >
          Are you an administrator?
        </AdminButton>
        <FacilitatorButton
          className="btn"
          onClick={() => handleButtonClick("facilitator")}
        >
          Are you a facilitator?
        </FacilitatorButton>
      </div>
      <Drawer  PaperProps={{    
        sx: { width: "50%" }
      }} anchor="right" open={drawerOpen} onClose={closeDrawer}>
         <IconButton
            onClick={closeDrawer}
            style={{ position: "absolute", right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        <Box sx={{ height: "100%", width: "80%", display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'}} onClick={closeDrawer}>
         
          <Login userRole={selectedRole} align="center"/>
        </Box>
      </Drawer>
    </Container>
  );
};

export default Welcome;
