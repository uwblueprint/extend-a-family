import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Box, Dialog, IconButton, Typography, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { VisuallyHidden } from "@reach/visually-hidden";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { Redirect } from "react-router-dom";
import UserAPIClient from "../../APIClients/UserAPIClient";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { getLocalStorageObjProperty } from "../../utils/LocalStorageUtils";

interface UploadProfilePictureModalProps {
  open: boolean;
  setUploadModalOpen: Dispatch<SetStateAction<boolean>>;
}

const UploadProfilePictureModal = ({
  open,
  setUploadModalOpen,
}: UploadProfilePictureModalProps) => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  let role: "Learner" | "Facilitator" | "Administrator";
  if (authenticatedUser?.role === "Learner") {
    role = "Learner";
  } else if (authenticatedUser?.role === "Facilitator") {
    role = "Facilitator";
  } else {
    role = "Administrator";
  }
  const theme = useTheme();

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const uploadFile = async (file: File | undefined) => {
    if (file) {
      const userId: string | null = getLocalStorageObjProperty(
        AUTHENTICATED_USER_KEY,
        "id",
      );
      if (userId) {
        const updatedUser = await UserAPIClient.uploadProfilePicture(
          userId,
          file,
        );
        setAuthenticatedUser({
          ...authenticatedUser!,
          profilePicture: updatedUser.profilePicture,
        });
      } else {
        <Redirect to={HOME_PAGE} />;
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file: File | undefined = event.dataTransfer.files[0];
    uploadFile(file);
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    uploadFile(file);
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          width: "616px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "32px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            margin: "0px",
            padding: "0px",
          }}
        >
          <Typography variant="headlineMedium" color="black">
            Upload Profile Picture
          </Typography>
        </Box>
        <IconButton
          onClick={() => {
            setUploadModalOpen(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        style={{
          width: "100%",
          height: "auto",
          backgroundImage: `repeating-linear-gradient(0deg, ${theme.palette[role].Dark.Default}, ${theme.palette[role].Dark.Default} 12px, transparent 12px, transparent 19px, ${theme.palette[role].Dark.Default} 19px), repeating-linear-gradient(90deg, ${theme.palette[role].Dark.Default}, ${theme.palette[role].Dark.Default} 12px, transparent 12px, transparent 19px, ${theme.palette[role].Dark.Default} 19px), repeating-linear-gradient(180deg, ${theme.palette[role].Dark.Default}, ${theme.palette[role].Dark.Default} 12px, transparent 12px, transparent 19px, ${theme.palette[role].Dark.Default} 19px), repeating-linear-gradient(270deg, ${theme.palette[role].Dark.Default}, ${theme.palette[role].Dark.Default} 12px, transparent 12px, transparent 19px, ${theme.palette[role].Dark.Default} 19px)`,
          backgroundSize: "1px 100%, 100% 1px, 1px 100% , 100% 1px",
          backgroundPosition: "0 0, 0 0, calc(100% - 1px) 0, 0 100%",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          paddingTop: "60px",
          paddingBottom: "60px",
          paddingLeft: "100px",
          paddingRight: "100px",
          gap: "16px",
          borderRadius: "4px",
          backgroundColor: theme.palette[role].Light.Default,
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <IconButton>
          <FileUploadOutlinedIcon
            sx={{
              width: "48px",
              height: "48px",
              color: "black",
            }}
          />
        </IconButton>
        <Typography color="black">
          Drag and drop your profile picture.
        </Typography>
        <VisuallyHidden>
          <input type="file" onChange={(e) => handleFileUpload(e)} multiple />
        </VisuallyHidden>
      </Box>

      <Box sx={{ width: "100%", color: theme.palette[role].Dark.Default }}>
        <Divider
          sx={{
            my: 1,
            borderBlockColor: theme.palette[role].Light.Hover,
            "&::before, &::after": {
              borderColor: theme.palette[role].Light.Hover, // Ensures both lines are the same color
            },
            margin: "0px",
          }}
        >
          OR
        </Divider>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Button
          sx={{
            width: "100%",
            background: theme.palette[role].Dark.Default,
            "&:hover": { background: theme.palette[role].Dark.Pressed },
          }}
          variant="contained"
          startIcon={<FileUploadOutlinedIcon />}
          component="label"
        >
          Choose File
          <VisuallyHidden>
            <input type="file" onChange={(e) => handleFileUpload(e)} multiple />
          </VisuallyHidden>
        </Button>
      </Box>
      <Typography
        sx={{
          color: theme.palette[role].Dark.Default,
          textAlign: "center",
          fontSize: "12.5px",
          fontWeight: 100,
        }}
      >
        SUPPORTED FILE TYPES: .PNG, .JPG, .WEBP
      </Typography>
    </Dialog>
  );
};

export default UploadProfilePictureModal;
