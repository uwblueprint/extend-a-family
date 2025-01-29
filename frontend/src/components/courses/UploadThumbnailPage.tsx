import {Container, Button} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import { VisuallyHidden } from '@reach/visually-hidden';
import React, {ChangeEvent, useState} from "react"
import CourseAPIClient from "../../APIClients/CourseAPIClient";

const UploadThumbnailPage = () => {
      const [thumbnail, setThumbnail] = useState("")

      interface ResData {
        buffer: {
          data: ArrayBuffer;
        };
        mimetype: string;
      }

      const displayImage = async(res: ResData) => {
        const buffer = new Uint8Array(res.buffer.data);
        const blob = new Blob([buffer], { type: res.mimetype });
        const blobURL = URL.createObjectURL(blob);
        setThumbnail(blobURL)
      }

      const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const {files} = event.target;
        if (!files || files.length === 0) {
            console.error('No file selected');
            return;
        }
        const file = files[0]
        const formData = new FormData();
        formData.append("uploadedImage", file);  
      
        try {
          await CourseAPIClient.uploadThumbnail( "98374892742", formData).then((res: ResData) => {
            displayImage(res)
          })

        } catch (error) {
          console.log(`Coulded Upload Image: ${error}`)
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
                <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                />
                </VisuallyHidden>
            </Button>
            <img src={thumbnail} alt=""/>
        </Container>
    )
}

export default UploadThumbnailPage