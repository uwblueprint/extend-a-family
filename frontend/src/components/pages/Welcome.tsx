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
import { AuthenticatedUser } from "../../types/AuthTypes";
import AuthContext from "../../contexts/AuthContext";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import authAPIClient from "../../APIClients/AuthAPIClient";
import background from "./backgroundImage.jpg";

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
    title: string;
  }

  const ImageOverlay: React.FC<ImageOverlayProps> = ({
    backgroundImage,
    title,
  }) => {
    return (
      <Card style={{ position: "relative", textAlign: "left" }}>
        <CardMedia
          component="img"
          height="300"
          image={backgroundImage}
          alt={title}
        />
        <Box
          style={{
            position: "absolute",
            color: "#fff",
            top: "70%",
            left: "10%",
          }}
        >
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </Box>
      </Card>
    );
  };

  return (
    <Container style={{ display: "flex", alignItems: "center", textAlign: "left" }}>
      <Box style={{ flex: 1, paddingRight: "16px" }}>
        <ImageOverlay
          backgroundImage={background}
          title="Smart Saving, Smart Spending"
        />
      </Box>
      <Box style={{ flex: 1 }}>
        <Box
          style={{
            backgroundColor: "#F5FAFC", // Light blue background
            padding: "16px",
            borderRadius: "8px",
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
        <div style={{ marginTop: "16px" }} className="button-container">
          <Button
            className="btn btn-primary"
            type="button"
            onClick={() => handleButtonClick("administrator")}
          >
            Administrator
          </Button>
          <Button
            className="btn btn-primary"
            type="button"
            onClick={() => handleButtonClick("facilitator")}
          >
            Facilitator
          </Button>
        </div>
      </Box>
    </Container>
  );
  
};

export default Welcome;
