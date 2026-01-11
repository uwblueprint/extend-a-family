import { CameraAlt } from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { Dispatch, SetStateAction } from "react";
import { useUser } from "../../hooks/useUser";

interface ProfilePictureProps {
  size: number;
  sourceUrl?: string;
  setUploadModalOpen?: Dispatch<SetStateAction<boolean>>;
}

const ProfilePicture = ({
  size,
  sourceUrl,
  setUploadModalOpen,
}: ProfilePictureProps): React.ReactElement => {
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
      onClick={() => {
        if (setUploadModalOpen) {
          setUploadModalOpen(true);
        }
      }}
    >
      <Avatar
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: theme.palette[user.role].Light.Hover,
          ...(!!setUploadModalOpen && {
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.6)",

              "& .avatar-text": {
                display: "none",
              },

              "& .camera-icon": {
                display: "block",
              },
            },
          }),
        }}
        src={sourceUrl}
      >
        <Typography
          sx={{
            color: theme.palette[user.role].Dark.Default,
            fontSize: 0.375 * size,
            fontWeight: 400,
            lineHeight: "140%",
          }}
        >
          {`${user.firstName.charAt(0) || ""}${user.lastName.charAt(0) || ""}`}
        </Typography>
        <CameraAlt
          className="camera-icon"
          sx={{
            position: "absolute",
            display: "none",
            color: "white",
            fontSize: 0.4 * size,
          }}
        />
      </Avatar>
    </Box>
  );
};

export default ProfilePicture;
