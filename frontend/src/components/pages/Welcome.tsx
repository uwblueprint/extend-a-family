import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardMedia,
  Box,
} from "@mui/material";
import styled from "@emotion/styled";
import { AuthenticatedUser } from "../../types/AuthTypes";
import AuthContext from "../../contexts/AuthContext";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import authAPIClient from "../../APIClients/AuthAPIClient";
import background from "./backgroundImage.jpg";
import icon from "./icon.png";

const Welcome = (): React.ReactElement => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthenticatedUser } = useContext(AuthContext);

  const handleButtonClick = (selectedRole: string) => {
    history.push(`/login?role=${selectedRole}`);
  };

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(email, password);
    const isUserVerified = user?.accessToken
      ? await authAPIClient.isUserVerified(email, user.accessToken)
      : null;
    if (!user || !isUserVerified) {
      alert("Bad login, user not found");
      return;
    }
    if (user.role.toLowerCase() !== "learner") {
      alert(`Bad login. Expected learner, got ${user.role}`);
      return;
    }

    localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    setAuthenticatedUser(user);
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
      <Card style={{height:"100%", position: "relative", textAlign: "left" }}>
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
          <img src={iconImage} alt="icon" style={{ paddingBottom: "10px", width: "100px" }} /> 
          
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
  }) 

  const FacilitatorButton = styled.button({
    backgroundColor: "#E0E0FF",
    width: "50%",
  });

  return (
    <Container 
      style={{display: "flex", flexDirection: "column", padding: "50px"}}>
      <Container
        style={{ height: "60vh",width:"80vw", display: "flex", alignItems: "center", textAlign: "left"}}
      >
        <Box style={{height:"100%", width: "50%", flex: 1 }}>
          <ImageOverlay
            backgroundImage={background}
            iconImage={icon}
            title="Smart Saving, Smart Spending"
          />
        </Box>
        <Box style={{ height:"100%", width: "50%", flex: 1 }}>
          <Box
            style={{
              backgroundColor: "#F5FAFC",
              height: "100%",
              padding:"50px 20px",
            }}
          >
            <Typography variant="h4">Learner Login</Typography>
            <form>
              <div>
                <TextField
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
              <div>
                <TextField
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onLogInClick}
                  fullWidth
                  style={{ margin: "16px 0" }}
                >
                  Log In
                </Button>
              </div>
            </form>
          </Box>
        </Box>
      </Container>
      <div
        style={{ width: "100%", marginTop: "16px", display: "flex", gap: "10px" }}
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
    </Container>
  );
};

export default Welcome;
