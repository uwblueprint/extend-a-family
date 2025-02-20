/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useRef, useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Box, Button, IconButton, Typography } from "@mui/material";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Document, Page, pdfjs, Thumbnail } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import useQuery from "../../hooks/useQuery";
import { CourseModule } from "../../types/CourseTypes";
import { padNumber } from "../../utils/StringUtils";
import "./ViewModulePage.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const ViewModulePage = () => {
  const searchParams = useQuery();
  const moduleId = searchParams.get("moduleId") || "";

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [bookMarkedPages, setBookMarkedPages] = useState(new Set<number>());
  const [module, setModule] = useState<
    (CourseModule & { lessonPdfUrl: string }) | null
  >(null);
  const lessonPageRef = useRef<HTMLDivElement>(null);
  const lessonPageContainerRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const fetchModule = useCallback(async () => {
    const fetchedModule = await CourseAPIClient.getModuleById(moduleId);
    return fetchedModule;
  }, [moduleId]);

  useEffect(() => {
    (async () => setModule(await fetchModule()))();
  }, [fetchModule, moduleId]);

  function getPageScale() {
    if (
      pageHeight === 0 ||
      containerHeight === 0 ||
      pageWidth === 0 ||
      containerWidth === 0
    ) {
      return 1;
    }
    const scaleToHeight = containerHeight / pageHeight;
    const scaleToWidth = containerWidth / pageWidth;
    return Math.min(scaleToHeight, scaleToWidth);
  }

  const handleResize = useCallback(() => {
    if (pageHeight === 0) {
      setPageHeight(lessonPageRef.current?.clientHeight || 0);
    }
    if (pageWidth === 0) {
      setPageWidth(lessonPageRef.current?.clientWidth || 0);
    }
    setContainerHeight(lessonPageContainerRef.current?.clientHeight || 0);
    setContainerWidth(
      Math.min(
        window.innerWidth,
        lessonPageContainerRef.current?.clientWidth || 0,
      ),
    );
  }, [pageHeight, pageWidth]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize, isFullScreen, pageHeight]);

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

  const boxHeight = "calc(100vh - 68px)";

  const SideBar = () => (
    <Box
      width="auto"
      minWidth="fit-content"
      maxHeight={boxHeight}
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
              border: currentPage === index + 1 ? "2px solid #006877" : "none",
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
  );

  return (
    <Document
      file={module?.lessonPdfUrl || null}
      onLoadSuccess={onDocumentLoadSuccess}
      options={options}
    >
      <Box display="flex" flexDirection="row">
        {!isFullScreen && <SideBar />}
        <Box
          alignItems="center"
          justifyContent="center"
          padding={isFullScreen ? "0px" : "40px"}
          display="flex"
          flexDirection="column"
          gap="24px"
          flexGrow="1"
          height={boxHeight}
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
                <Typography>{module?.title}</Typography>
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
            bgcolor={isFullScreen ? "black" : "white"}
            ref={lessonPageContainerRef}
          >
            <Page
              pageNumber={currentPage}
              renderAnnotationLayer={false}
              scale={getPageScale()}
              inputRef={lessonPageRef}
            />
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
                  border: "1px solid black",
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
                  border: "1px solid black",
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
