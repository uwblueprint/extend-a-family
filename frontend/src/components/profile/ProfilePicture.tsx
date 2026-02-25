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
        position: "relative",
        display: "flex",
        width: `${size}px`,
        height: `${size}px`,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5000px",
        cursor: setUploadModalOpen ? "pointer" : "default",
        ...(!!setUploadModalOpen && {
          "&:hover .avatar-overlay": {
            opacity: 1,
          },
          "&:hover .avatar-text": {
            display: "none",
          },
        }),
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
        }}
        src={sourceUrl}
      >
        <Typography
          className="avatar-text"
          sx={{
            color: theme.palette[user.role].Dark.Default,
            fontSize: 0.375 * size,
            fontWeight: 400,
            lineHeight: "140%",
          }}
        >
          {`${user.firstName.charAt(0) || ""}${user.lastName.charAt(0) || ""}`}
        </Typography>
      </Avatar>
      {!!setUploadModalOpen && (
        <Box
          className="avatar-overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0,
            transition: "opacity 0.2s",
          }}
        >
          <CameraAlt
            sx={{
              color: "white",
              fontSize: 0.4 * size,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProfilePicture;
