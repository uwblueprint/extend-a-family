import Button from "@mui/material/Button";

import * as React from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import CourseAPIClient from "../../APIClients/CourseAPIClient";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files) {
    // eslint-disable-next-line no-alert
    alert("Error: No files selected");
    return;
  }
  const file = event.target.files[0];
  // eslint-disable-next-line no-alert
  CourseAPIClient.lessonUpload(file, prompt("Enter module ID:")!);
};

const LessonUpload = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>My Account</h1>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput type="file" onChange={handleFileUpload} multiple />
      </Button>
    </div>
  );
};

export default LessonUpload;
