import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

interface ProfilePictureProps {
  firstName?: string;
  lastName?: string;
}

const ProfilePicture = ({ firstName = "", lastName = "" }: ProfilePictureProps): React.ReactElement => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "160px",
        height: "160px",
        padding: "26.667px",
        justifyContent: "center",
        alignItems: "center",
        gap: "66.667px",
        borderRadius: "5000px",
        background: "#D5F7FF",
      }}
    >
      <Avatar sx={{ width: "100%", height: "100%", bgcolor: "#D5F7FF" }}>
        <Typography
          sx={{
            color: "var(--Schemes-Primary, #006877)",
            fontFamily: "Lexend Deca",
            fontSize: "60px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "140%", // 84px
            letterSpacing: "-3px",
          }}
        >
          {`${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`}
        </Typography>
      </Avatar>
    </Box>
  );
};

export default ProfilePicture;