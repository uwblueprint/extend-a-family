/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from "react";
import { pdfjs, Document, Page, Thumbnail } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { padNumber } from "../../utils/StringUtils";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PDFFile = string | File | null;

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const ViewModulePage = () => {
  const [file, setFile] = useState<PDFFile>("/test_lesson.pdf");
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  return (
    <Box ref={setContainerRef}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
      >
        <Box display="flex" flexDirection="row">
          <Box
            sx={{
              width: "auto",
              maxHeight: "100vh",
              overflowY: "auto",
              gapY: "24px",
              paddingX: "24px",
              borderRight: "1px solid #ddd",
            }}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Box
                key={`thumbnail_${index + 1}`}
                sx={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyItems: "center",
                  flexDirection: "row",
                  gap: "8px",
                }}
                onClick={() => setCurrentPage(index + 1)}
              >
                <Box
                  sx={{
                    color: index + 1 === currentPage ? "#006877" : "black",
                  }}
                >
                  <Typography
                    sx={{
                      lineHeight: "15px",
                      fontSize: "12.5px",
                      fontWeight: index + 1 === currentPage ? "700" : "300",
                    }}
                  >
                    {padNumber(index + 1)}
                  </Typography>
                  {index + 1 === currentPage && (
                    <BookmarkIcon sx={{ fontSize: "16px" }} />
                  )}
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    border:
                      currentPage === index + 1 ? "2px solid #006877" : "none",
                    borderRadius: "4px",
                    width: "fit-content",
                  }}
                >
                  {currentPage === index + 1 && (
                    <PlayCircleOutlineIcon
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "60px",
                        zIndex: "1",
                      }}
                    />
                  )}
                  <Thumbnail pageNumber={index + 1} height={130} scale={1.66} />
                </Box>
              </Box>
            ))}
          </Box>

          <Page
            pageNumber={currentPage}
            renderAnnotationLayer={false}
            renderForms={false}
            width={670}
            height={1000}
            renderMode="canvas"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              height: "48px",
            }}
          >
            <IconButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((curr) => curr - 1)}
              sx={{
                border: "2px solid black",
                height: "48px",
                width: "48px",
                padding: "8px",
              }}
            >
              <ArrowBackIcon
                sx={{
                  fontSize: "16px",
                }}
              />
            </IconButton>
            <Typography
              sx={{
                alignSelf: "center",
                fontSize: "18px",
                fontWeight: "400",
              }}
            >
              {padNumber(currentPage)}
            </Typography>

            <IconButton
              disabled={currentPage === numPages}
              onClick={() => setCurrentPage((curr) => curr + 1)}
              sx={{
                border: "2px solid black",
                height: "48px",
                width: "48px",
                padding: "8px",
              }}
            >
              <ArrowForwardIcon
                sx={{
                  fontSize: "16px",
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Document>
    </Box>
  );
};

export default ViewModulePage;
