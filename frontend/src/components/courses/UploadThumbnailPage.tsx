import { Container, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHidden } from "@reach/visually-hidden";
import React, { ChangeEvent, useState } from "react";
import CourseAPIClient from "../../APIClients/CourseAPIClient";

const UploadThumbnailPage = () => {
  const [thumbnail, setThumbnail] = useState("");

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length === 0) {
      throw new Error("no file selected");
    }
    const file = files[0];
    const formData = new FormData();
    formData.append("uploadedImage", file);

    try {
      await CourseAPIClient.uploadThumbnail("6775be1afa8027fddf428b3f", formData).then(
        (res) => {
          console.log(res)
          setThumbnail(res);
        },
      );
    } catch (error) {
      throw new Error(`Coulded Upload Image: ${error}`);
    }
  };

  return (
    <Container>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHidden>
          <input type="file" onChange={handleFileUpload} multiple />
        </VisuallyHidden>
      </Button>
      <img src={thumbnail} alt="" />
    </Container>
  );
};

export default UploadThumbnailPage;
