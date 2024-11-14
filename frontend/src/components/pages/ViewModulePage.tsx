/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { pdfjs, Document, Page, Thumbnail } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
  Input,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { padNumber } from "../../utils/StringUtils";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "./ViewModulePage.css";

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
  const [file] = useState<PDFFile>("/test_lesson.pdf");
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [bookMarkedPages, setBookMarkedPages] = useState(new Set<number>());

  const onDocumentLoadSuccess = ({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void => {
    setNumPages(nextNumPages);
  };

  const toggleBookmark = (pageNumber: number) => {
    setBookMarkedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageNumber)) {
        newSet.delete(pageNumber);
      } else {
        newSet.add(pageNumber);
      }
      return newSet;
    });
  };

  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      options={options}
      className="document-override"
    >
      <Box display="flex" flexDirection="row" height="100%">
        {!isFullScreen && (
          <Box
            width="auto"
            maxHeight="100vh"
            padding="24px"
            borderRight="1px solid #ddd"
            sx={{
              overflowY: "auto",
              gapY: "24px",
            }}
            className="no-scrollbar"
          >
            {Array.from(new Array(numPages), (_, index) => (
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
        )}
        <Box
          alignItems="center"
          justifyContent="center"
          padding={isFullScreen ? "0px" : "40px"}
          display="flex"
          flexDirection="column"
          gap="24px"
          flexGrow="1"
          height="100%"
        >
          {!isFullScreen && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Box display="inline-flex" alignItems="center">
                <IconButton
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: "24px" }} />
                </IconButton>
                <Typography>Module 4.5 - Investing</Typography>
              </Box>
              <Box display="inline-flex" alignItems="center" gap="20px">
                <Button
                  sx={{
                    paddingX: "12px",
                    paddingY: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  Need Help?
                </Button>
                <IconButton
                  sx={{
                    border: "1px solid #79747E",
                    height: "48px",
                    width: "48px",
                    padding: "8px",
                  }}
                  onClick={() => toggleBookmark(currentPage)}
                >
                  {bookMarkedPages.has(currentPage) ? (
                    <BookmarkIcon sx={{ fontSize: "24px", color: "#006877" }} />
                  ) : (
                    <BookmarkBorderIcon
                      sx={{ fontSize: "24px", color: "#006877" }}
                    />
                  )}
                </IconButton>
              </Box>
            </Box>
          )}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            flexGrow="1"
            sx={{ overflow: "hidden", position: "relative" }}
          >
            <Page pageNumber={currentPage} renderAnnotationLayer={false} />
            {/* <Input
              sx={{
                position: "absolute",
                zIndex: 999,
                top: "50%", // customizable
                left: "50%", // customizable
                width: "50%", // customizable
              }}
            /> */}
          </Box>
          <Box
            height={isFullScreen ? "80px" : "48px"}
            paddingY={isFullScreen ? "16px" : "0px"}
            paddingX={isFullScreen ? "32px" : "0px"}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box display="flex" gap="16px">
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
                <ArrowBackIcon sx={{ fontSize: "16px" }} />
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
                <ArrowForwardIcon sx={{ fontSize: "16px" }} />
              </IconButton>
            </Box>

            <Button
              sx={{
                height: "48px",
                paddingLeft: "16px",
                paddingRight: "24px",
                paddingY: "10px",
                gap: "8px",
                border: "1px #6F797B solid",
                borderRadius: "4px",
              }}
              onClick={() => setIsFullScreen((prev) => !prev)}
            >
              <FullscreenIcon />
              Fullscreen
            </Button>
          </Box>
        </Box>
      </Box>
    </Document>
  );
};

export default ViewModulePage;
