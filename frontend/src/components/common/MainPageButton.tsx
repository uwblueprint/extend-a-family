import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, Typography, useTheme } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import { LANDING_PAGE } from "../../constants/Routes";
import { useUser } from "../../hooks/useUser";

const MainPageButton = (): React.ReactElement => {
  const history = useHistory();
  const theme = useTheme();
  const user = useUser();

  const navigateTo = () => history.push(LANDING_PAGE);
  return (
    <>
      <Button
        variant="text"
        onClick={navigateTo}
        startIcon={
          <ChevronLeftIcon
            sx={{ color: theme.palette[user.role].Dark.Default }}
          />
        }
        sx={{
          display: "flex",
          padding: "10px 16px 10px 12px",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          flex: "1 0 0",
          alignSelf: "stretch",
          position: "absolute",
          left: "12px",
          top: "80px",
          borderRadius: "4px",
        }}
      >
        <Typography
          variant="labelLarge"
          sx={{
            color: theme.palette[user.role].Dark.Default,
          }}
        >
          Back
        </Typography>
      </Button>
    </>
  );
};

export default MainPageButton;
