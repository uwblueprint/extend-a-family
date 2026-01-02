import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { VisuallyHidden } from "@reach/visually-hidden";
import React, { ChangeEvent, useEffect, useState } from "react";
import CourseAPIClient from "../../../APIClients/CourseAPIClient";

interface ChangeThumbnailModalProps {
  open: boolean;
  onClose: () => void;
  moduleId: string;
  currentImageUrl: string | undefined;
  onThumbnailUpdate?: (newImageUrl: string) => void;
}

const ChangeThumbnailModal = ({
  open,
  onClose,
  moduleId,
  currentImageUrl,
  onThumbnailUpdate,
}: ChangeThumbnailModalProps) => {
  const theme = useTheme();
  const [image, setImage] = useState<FormData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const uploadFile = async (file: File | undefined) => {
    if (file) {
      const formData = new FormData();
      formData.append("uploadedImage", file);
      const uploadedImageUrl = URL.createObjectURL(file);
      setImageUrl(uploadedImageUrl);
      setImage(formData);
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

  const handleUpload = async () => {
    if (!image) {
      return;
    }

    const newImageUrl = await CourseAPIClient.uploadThumbnail(
      moduleId,
      image as unknown as FormData,
    );

    if (newImageUrl && onThumbnailUpdate) {
      onThumbnailUpdate(newImageUrl);
    }

    onClose();
  };

  useEffect(() => {
    if (open) {
      setImage(null);
      setImageUrl(null);
    }
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
            Change Thumbnail
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt="Module Thumbnail"
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: "297px",
            borderRadius: "4px",
          }}
        />
      )}
      {!imageUrl && currentImageUrl && (
        <Box
          component="img"
          src={currentImageUrl}
          alt="Current Module Thumbnail"
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: "297px",
            borderRadius: "4px",
          }}
        />
      )}
      {!imageUrl && !currentImageUrl && (
        <Box
          style={{
            width: "100%",
            height: "auto",
            backgroundImage: `
              linear-gradient(${theme.palette.Administrator.Dark.Default}, ${theme.palette.Administrator.Dark.Default}),
              linear-gradient(${theme.palette.Administrator.Dark.Default}, ${theme.palette.Administrator.Dark.Default}),
              linear-gradient(${theme.palette.Administrator.Dark.Default}, ${theme.palette.Administrator.Dark.Default}),
              linear-gradient(${theme.palette.Administrator.Dark.Default}, ${theme.palette.Administrator.Dark.Default})
            `,
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
      )}

      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleUpload} disabled={!image}>
          Upload
        </Button>
      </Box>
    </Dialog>
  );
};

export default ChangeThumbnailModal;
