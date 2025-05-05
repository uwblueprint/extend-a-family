import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useUser } from "../../hooks/useUser";

interface ProfilePictureProps {
  size: number;
}

const ProfilePicture = ({ size }: ProfilePictureProps): React.ReactElement => {
  const theme = useTheme();
  const user = useUser();

  return (
    <Box
      sx={{
        display: "flex",
        width: `${size}px`,
        height: `${size}px`,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5000px",
      }}
    >
      <Avatar
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: theme.palette[user.role].Hover,
        }}
      >
        <Typography
          sx={{
            color: theme.palette[user.role].Default,
            fontSize: 0.375 * size,
            fontWeight: 400,
            lineHeight: "140%",
          }}
        >
          {`${user.firstName.charAt(0) || ""}${user.lastName.charAt(0) || ""}`}
        </Typography>
      </Avatar>
    </Box>
  );
};

export default ProfilePicture;
