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

const LessonUpload = (): React.ReactElement => {
  const [files, setFiles] = React.useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  const handleFileUpload = () => {
    if (!files || files.length === 0) {
      // eslint-disable-next-line no-alert
      alert("Error: No files selected");
      return;
    }
    const file = files[0];
    // eslint-disable-next-line no-alert
    CourseAPIClient.lessonUpload(file, prompt("Enter module ID:")!);
  };

  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Upload Lesson PDF</h1>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput type="file" onChange={handleFileChange} multiple />
      </Button>
      <div>
        {files &&
          files.length > 0 &&
          ` (${files.length} file${files.length > 1 ? "s" : ""})`}
      </div>
      <Button onClick={handleFileUpload} sx={{ mt: 0.5 }}>
        Submit
      </Button>
    </div>
  );
};

export default LessonUpload;
