import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ModeIcon from "@mui/icons-material/Mode";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { VisuallyHidden } from "@reach/visually-hidden";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import UserAPIClient from "../../../APIClients/UserAPIClient";
import AUTHENTICATED_USER_KEY from "../../../constants/AuthConstants";
import AuthContext from "../../../contexts/AuthContext";
import { getLocalStorageObjProperty } from "../../../utils/LocalStorageUtils";

interface CreateModuleModalProps {
  open: boolean;
  setUploadModalOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateModuleModal = ({
  open,
  setUploadModalOpen,
}: CreateModuleModalProps) => {
  const { authenticatedUser } = useContext(AuthContext);
  const theme = useTheme();
  // const [imageUrl, setImageUrl] = useState(null); // TODO: use when backend returns imageUrl
  const [imageStatus, setImageStatus] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");

  let role: "Learner" | "Facilitator" | "Administrator";
  if (authenticatedUser?.role === "Learner") {
    role = "Learner";
  } else if (authenticatedUser?.role === "Facilitator") {
    role = "Facilitator";
  } else {
    role = "Administrator";
  }

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
        const uploadedImageUrl = await UserAPIClient.uploadProfilePicture(
          // TODO: call different API
          userId,
          file,
        );
        console.log(uploadedImageUrl);
        setImageStatus("Uploaded successfully!");
        // setImageUrl(uploadedImageUrl);
      } else {
        setImageStatus("Cannot upload right now. Please try again later!");
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

  const handleCreate = async () => {
    const params = {
      imageUrl: "", // TODO: use the URL returned on upload
      moduleTitle,
    };
    console.log("Calling create with params", params);
    // TODO: call the backend to create module

    setUploadModalOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    // setImageUrl("");
    setImageStatus("");
    setModuleTitle("");
  }, [open]);

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "620px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
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
          <Typography
            variant="headlineMedium"
            color={theme.palette.Neutral[700]}
          >
            Create new module
          </Typography>
        </Box>
        <IconButton onClick={() => setUploadModalOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      {/* TODO: display imageUrl instead of upload box when backend returns image blob */}
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
          paddingLeft: "90px",
          paddingRight: "90px",
          gap: "24px",
          borderRadius: "4px",
          backgroundColor: theme.palette.Administrator.Light.Default,
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
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "6px",
            }}
          >
            <Typography variant="bodySmall" color="black">
              Drag and drop or
            </Typography>
            <Typography
              variant="bodySmall"
              color={theme.palette.Administrator.Dark.Default}
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => {
                const inputElem = document.getElementById("clickHereInput");
                inputElem?.click();
              }}
            >
              click here
            </Typography>
            <VisuallyHidden>
              <input
                id="clickHereInput"
                type="file"
                onChange={(e) => handleFileUpload(e)}
                multiple
              />
            </VisuallyHidden>
            <Typography variant="bodySmall" color="black">
              to upload thumbnail
            </Typography>
          </Box>
          <Typography
            variant="bodySmall"
            color={theme.palette.Administrator.Dark.Default}
          >
            Recommended aspect ratio: 4:3 image
          </Typography>
        </Box>
        <Typography
          variant="labelSmall"
          color={theme.palette.Administrator.Dark.Default}
        >
          Supported file types: .png, .jpg, .webp
        </Typography>
      </Box>

      <Typography
        style={{
          display: imageStatus !== "" ? "flex" : "none",
          marginTop: "-16px",
        }}
        color={theme.palette.Administrator.Dark.Default}
      >
        {imageStatus}
      </Typography>

      <TextField
        label="Module Title"
        variant="outlined"
        style={{
          display: "flex",
          padding: "4px 0",
          flex: "1 0 0",
        }}
        onChange={(e) => setModuleTitle(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ModeIcon
                style={{
                  display: "flex",
                  width: "40px",
                  height: "40px",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "8px",
                  gap: "10px",
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <Button variant="outlined" onClick={() => setUploadModalOpen(false)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </Box>
    </Dialog>
  );
};

export default CreateModuleModal;
