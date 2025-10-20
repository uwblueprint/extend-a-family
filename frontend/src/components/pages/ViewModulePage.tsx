/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Document, Page, pdfjs, Thumbnail } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import * as Routes from "../../constants/Routes";
import useActivity from "../../hooks/useActivity";
import useQueryParams from "../../hooks/useQueryParams";
import {
  Activity,
  CourseModule,
  isActivityPage,
  isLessonPage,
  isMultipleChoiceActivity,
  isMultiSelectActivity,
} from "../../types/CourseTypes";
import { padNumber } from "../../utils/StringUtils";
import MultipleChoiceMainEditor from "../course_authoring/multiple-choice/MultipleChoiceEditor";
import MultipleChoiceEditorSidebar from "../course_authoring/multiple-choice/MultipleChoiceSidebar";
import FeedbackThumbnail from "../courses/moduleViewing/learner-giving-feedback/FeedbackThumbnail";
import SurveySlides from "../courses/moduleViewing/learner-giving-feedback/SurveySlides";
import ModuleSidebarThumbnail from "../courses/moduleViewing/Thumbnail";
import NeedHelpModal from "../help/NeedHelpModal";
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
  const { queryParams } = useQueryParams();
  const requestedModuleId = queryParams.get("moduleId") || "";
  const requestedPageId = queryParams.get("pageId") || "";

  const [currentPage, setCurrentPage] = useState(0);
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
  const theme = useTheme();
  const currentPageObject = module?.pages[currentPage];
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numPages = module?.pages.length || 0;

  const isDidYouLikeTheContentPage = currentPage === numPages;

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const [hasImage, setHasImage] = useState(
    (currentPageObject &&
      isActivityPage(currentPageObject) &&
      !!currentPageObject.imageUrl) ||
      false,
  );
  const [hasAdditionalContext, setHasAdditionalContext] = useState(false);

  const { activity, setActivity } = useActivity<Activity>(undefined);

  useEffect(() => {
    if (currentPageObject && isActivityPage(currentPageObject)) {
      setActivity(currentPageObject);
      if (currentPageObject.imageUrl) {
        setHasImage(true);
      }
      if (currentPageObject.additionalContext) {
        setHasAdditionalContext(true);
      }
    }
  }, [currentPageObject, setActivity]);

  useEffect(() => {
    setModule((prevModule) => {
      if (!prevModule) return prevModule;
      const updatedPages = prevModule.pages.map((page) => {
        if (isActivityPage(page) && activity && page.id === activity.id) {
          return activity;
        }
        return page;
      });
      return { ...prevModule, pages: updatedPages };
    });
  }, [activity]);

  const fetchModule = useCallback(async () => {
    const fetchedModule = await CourseAPIClient.getModuleById(
      requestedModuleId,
    );
    return fetchedModule;
  }, [requestedModuleId]);

  const currentPageId = module?.pages[currentPage]?.id;

  useEffect(() => {
    if (currentPageId) {
      window.history.pushState(
        { moduleId: module?.id, pageId: currentPageId },
        "",
        `${Routes.VIEW_PAGE}?${new URLSearchParams({
          moduleId: requestedModuleId,
          pageId: currentPageId,
        }).toString()}`,
      );
    }
  }, [currentPageId, module?.id, requestedModuleId]);

  useEffect(() => {
    (async () => {
      const currentModule = await fetchModule();
      setModule(currentModule);
      const defaultCurrentPage = currentModule?.pages.findIndex((page) => {
        return page.id === requestedPageId;
      });
      if (defaultCurrentPage && defaultCurrentPage !== -1) {
        setCurrentPage(defaultCurrentPage);
      }
    })();
  }, [fetchModule, requestedPageId]);

  useEffect(() => {
    if (thumbnailRefs.current[currentPage]) {
      thumbnailRefs.current[currentPage]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  const getPageScale = () => {
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
  };

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

  const SideBar = useMemo(
    () => (
      <Box
        width="auto"
        minWidth="fit-content"
        maxHeight={boxHeight}
        padding="24px"
        sx={{
          backgroundColor: theme.palette.Neutral[200],
          overflowY: "auto",
          gapY: "24px",
          ...(isFullScreen && { display: "none" }),
        }}
        className="no-scrollbar"
      >
        {module?.pages
          .map((page, index) => (
            <ModuleSidebarThumbnail
              key={`thumbnail_${index}`}
              index={index}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              thumbnailRefs={thumbnailRefs}
            >
              {isActivityPage(page) && (
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
              {isLessonPage(page) && (
                <Thumbnail
                  pageNumber={page.pageIndex}
                  height={130}
                  scale={1.66}
                />
              )}
              {isActivityPage(page) && (
                <Thumbnail
                  pageNumber={1} // Placeholder for activity page thumbnail
                  renderMode="custom"
                  customRenderer={() => <Box height={215} width={280} />}
                />
              )}
            </ModuleSidebarThumbnail>
          ))
          .concat(
            <ModuleSidebarThumbnail
              key="feedback_thumbnail"
              index={numPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              thumbnailRefs={thumbnailRefs}
            >
              <FeedbackThumbnail />
            </ModuleSidebarThumbnail>,
          )}
      </Box>
    ),
    [currentPage, isFullScreen, module?.pages, numPages, theme.palette.Neutral],
  );

  return (
    <Document file={module?.lessonPdfUrl || null} options={options}>
      <Box display="flex" flexDirection="row">
        {SideBar}
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
                <Typography variant="headlineLarge">{module?.title}</Typography>
              </Box>
              <Box display="inline-flex" alignItems="center" gap="20px">
                <Button
                  sx={{
                    paddingX: "12px",
                    paddingY: "10px",
                  }}
                  onClick={() => setIsHelpModalOpen(true)}
                >
                  <Typography
                    color={theme.palette.Learner.Dark.Default}
                    variant="labelLarge"
                  >
                    Need Help?
                  </Typography>
                </Button>
                <IconButton
                  sx={{
                    border: "1px solid",
                    borderColor: theme.palette.Neutral[500],
                    height: "48px",
                    width: "48px",
                    padding: "8px",
                  }}
                  onClick={() => toggleBookmark(currentPage)}
                >
                  {bookMarkedPages.has(currentPage) ? (
                    <BookmarkIcon
                      sx={{
                        fontSize: "24px",
                        color: theme.palette.Learner.Dark.Default,
                      }}
                    />
                  ) : (
                    <BookmarkBorderIcon
                      sx={{
                        fontSize: "24px",
                        color: theme.palette.Learner.Dark.Default,
                      }}
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
            {currentPageObject && isLessonPage(currentPageObject) && (
              <Page
                pageNumber={currentPageObject.pageIndex}
                renderAnnotationLayer={false}
                scale={getPageScale()}
                onLoadSuccess={() => handleResize()}
                inputRef={lessonPageRef}
              />
            )}
            {currentPageObject && isActivityPage(currentPageObject) && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
              >
                {activity &&
                  (isMultipleChoiceActivity(activity) ||
                    isMultiSelectActivity(activity)) && (
                    <MultipleChoiceMainEditor
                      activity={activity}
                      setActivity={setActivity}
                      hasImage={hasImage}
                      hasAdditionalContext={hasAdditionalContext}
                    />
                  )}
              </Box>
            )}
            {isDidYouLikeTheContentPage && <SurveySlides />}
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
                disabled={currentPage <= 0}
                onClick={() => setCurrentPage(currentPage - 1)}
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
                variant="titleMedium"
                sx={{
                  alignSelf: "center",
                  fontSize: "18px",
                  fontWeight: "400",
                }}
              >
                {padNumber(currentPage + 1)}
              </Typography>
              <IconButton
                disabled={currentPage >= numPages - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
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
                border: "1px solid",
                borderColor: theme.palette.Neutral[500],
                borderRadius: "4px",
                color: theme.palette.Learner.Dark.Default,
              }}
              onClick={() => setIsFullScreen((prev) => !prev)}
            >
              <FullscreenIcon />
              <Typography variant="labelLarge">Fullscreen</Typography>
            </Button>
          </Box>
        </Box>
        {currentPageObject &&
          (isMultipleChoiceActivity(currentPageObject) ||
            isMultiSelectActivity(currentPageObject)) && (
            <>
              <Divider orientation="vertical" flexItem />
              <MultipleChoiceEditorSidebar
                hasImage={hasImage}
                setHasImage={(newHasImage) => {
                  setHasImage(newHasImage);
                  if (!newHasImage) {
                    setActivity((prev) => prev && { ...prev, imageUrl: "" });
                  }
                }}
                hasAdditionalContext={hasAdditionalContext}
                setHasAdditionalContext={(newHasAdditionalContext) => {
                  setHasAdditionalContext(newHasAdditionalContext);
                  if (!newHasAdditionalContext) {
                    setActivity(
                      (prev) => prev && { ...prev, additionalContext: "" },
                    );
                  }
                }}
                onAddQuestionOption={() =>
                  setActivity(
                    (prev) =>
                      prev && { ...prev, options: [...prev.options, ""] },
                  )
                }
                hint={currentPageObject.hint || ""}
                setHint={(newHint: string) => {
                  setActivity((prev) => prev && { ...prev, hint: newHint });
                }}
                isMultiSelect={isMultiSelectActivity(currentPageObject)}
                isAddOptionDisabled={currentPageObject.options.length >= 4}
              />
            </>
          )}
      </Box>
      <NeedHelpModal
        open={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        module={module}
        currentPage={currentPageObject || null}
      />
    </Document>
  );
};

export default ViewModulePage;
