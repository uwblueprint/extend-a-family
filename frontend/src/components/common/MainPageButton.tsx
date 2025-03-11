import React from "react";
import { Typography, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useHistory } from "react-router-dom";
import { HOME_PAGE } from "../../constants/Routes";

const MainPageButton = (): React.ReactElement => {
  const history = useHistory();
  const navigateTo = () => history.push(HOME_PAGE);
  return (
    <>
      <Button
        variant="text"
        onClick={navigateTo}
        startIcon={<ChevronLeftIcon sx={{ color: "#555A92" }} />}
        sx={{
          display: "flex",
          padding: "10px 16px 10px 12px",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          flex: "1 0 0",
          alignSelf: "stretch",
          position: "absolute",
          left: "36px",
          top: "86px",
          borderRadius: "4px",
        }}
      >
        <Typography
          sx={{
            color: "var(--Schemes-Tertiary, #555A92)",
            textAlign: "center",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 300,
            lineHeight: "120%",
            letterSpacing: "0.7px",
            textTransform: "uppercase",
          }}
        >
          Back
        </Typography>
      </Button>
    </>
  );
};

export default MainPageButton;
