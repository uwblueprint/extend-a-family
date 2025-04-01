import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useUser } from "../../hooks/useUser";

interface ProfilePictureProps {
  firstName?: string;
  lastName?: string;
}

const ProfilePicture = ({
  firstName = "",
  lastName = "",
}: ProfilePictureProps): React.ReactElement => {
  const theme = useTheme();
  const user = useUser();

  return (
    <Box
      sx={{
        display: "flex",
        width: "160px",
        height: "160px",
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
            color: theme.palette[user.role].Default,
            fontSize: "60px",
            fontWeight: 400,
            lineHeight: "140%",
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
