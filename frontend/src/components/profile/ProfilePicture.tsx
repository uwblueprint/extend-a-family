import React, { Dispatch, SetStateAction } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CameraAlt } from "@mui/icons-material";
import { useUser } from "../../hooks/useUser";

interface ProfilePictureProps {
  size: number;
  setUploadModalOpen: Dispatch<SetStateAction<boolean>> | null;
  sourceUrl?: string;
}

const ProfilePicture = ({
  size,
  setUploadModalOpen,
  sourceUrl,
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
          bgcolor: theme.palette[user.role].Hover,
          // "&:hover": {
          //   backgroundColor: "rgba(0, 0, 0, 0.6)",

          //   "& .avatar-text": {
          //     display: "none",
          //   },

          //   "& .camera-icon": {
          //     display: "block",
          //   },
          // },
          ":hover": {
            backgroundColor: "rgba(0, 0, 0, 0.6)",

            "& .avatar-text": {
              display: "none",
            },

            "& .camera-icon": {
              display: "block",
            },
          }
        }}
        // src={"https://firebasestorage.googleapis.com/v0/b/extendafamily-7613e.appspot.com/o/user%2FprofilePicture%2F67eb2ab6573648d85acc9dcb?alt=media&token=caf34eb7-e9a1-4da7-a7c4-702ecdc693f3"}
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
