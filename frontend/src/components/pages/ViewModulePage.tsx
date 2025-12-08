/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  CheckCircleOutline,
  DeleteOutline,
  Refresh,
  VisibilityOutlined,
} from "@mui/icons-material";
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
import UserAPIClient from "../../APIClients/UserAPIClient";
import * as Routes from "../../constants/Routes";
import { COURSE_PAGE } from "../../constants/Routes";
import useActivity from "../../hooks/useActivity";
import useQueryParams from "../../hooks/useQueryParams";
import { useUser } from "../../hooks/useUser";
import {
  Activity,
  CourseModule,
  isActivityPage,
  isLessonPage,
  isMatchingActivity,
  isMultipleChoiceActivity,
  isMultiSelectActivity,
  isTableActivity,
  Media,
} from "../../types/CourseTypes";
import { Bookmark } from "../../types/UserTypes";
import { padNumber } from "../../utils/StringUtils";
import PreviewLearnerModal from "../course_authoring/editorComponents/PreviewLearnerModal";
import MatchingEditor from "../course_authoring/matching/MatchingEditor";
import MatchingSidebar from "../course_authoring/matching/MatchingSidebar";
import MultipleChoiceMainEditor from "../course_authoring/multiple-choice/MultipleChoiceEditor";
import MultipleChoiceEditorSidebar from "../course_authoring/multiple-choice/MultipleChoiceSidebar";
import TableMainEditor from "../course_authoring/table/TableEditor";
import TableSidebar from "../course_authoring/table/TableSidebar";
import MatchingViewer from "../course_viewing/matching/MatchingViewer";
import WrongAnswerModal from "../course_viewing/modals/WrongAnswerModal";
import MultipleChoiceViewer, {
  ActivityViewerHandle,
} from "../course_viewing/multiple-choice/MultipleChoiceViewer";
import TableViewer from "../course_viewing/table/TableViewer";
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
  const requestedUnitId = queryParams.get("unitId") || "";
  const { role } = useUser();

  const [currentPage, setCurrentPage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
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
  const [isWrongAnswerModalOpen, setIsWrongAnswerModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [hasImage, setHasImage] = useState(
    (currentPageObject &&
      isActivityPage(currentPageObject) &&
      !!currentPageObject.imageUrl) ||
      false,
  );
  const [hasAdditionalContext, setHasAdditionalContext] = useState(false);

  const { activity, setActivity } = useActivity<Activity>(undefined);

  const activityViewerRef = useRef<ActivityViewerHandle>(null);

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

  const isCurrentPageBookmarked = useMemo(() => {
    if (!module?.pages[currentPage]) return false;
    const pageId = module.pages[currentPage].id;
    return bookmarks.some((bookmark) => bookmark.pageId === pageId);
  }, [bookmarks, module, currentPage]);

  const isPageBookmarked = useCallback(
    (pageId: string) => {
      return bookmarks.some((bookmark) => bookmark.pageId === pageId);
    },
    [bookmarks],
  );

  const fetchBookmarks = useCallback(async () => {
    try {
      const userData = await UserAPIClient.getCurrentUser();
      setBookmarks(userData.bookmarks || []);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error("Failed to fetch bookmarks:", error);
    }
  }, []);

  const toggleBookmark = async (pageNumber: number) => {
    if (!module?.pages[pageNumber]) return;

    const page = module.pages[pageNumber];
    const pageId = page.id;
    const isBookmarked = isPageBookmarked(pageId);

    setIsBookmarkLoading(true);
    try {
      let updatedBookmarks: Bookmark[];

      if (isBookmarked) {
        updatedBookmarks = await UserAPIClient.deleteBookmark(pageId);
      } else {
        updatedBookmarks = await UserAPIClient.addBookmark(
          requestedUnitId,
          requestedModuleId,
          pageId,
        );
      }

      setBookmarks(updatedBookmarks);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

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
              isBookmarked={isPageBookmarked(page.id)}
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
    [
      currentPage,
      isFullScreen,
      module?.pages,
      numPages,
      theme.palette.Neutral,
      isPageBookmarked,
    ],
  );

  const setNumColumns = (newNumColumns: number) => {
    setActivity((prev) => {
      if (!prev || !isTableActivity(prev)) return prev;
      const currentNumColumns = prev.columnLabels.length;

      let updatedColumnLabels = [...prev.columnLabels];
      let updatedCorrectAnswers = [...prev.correctAnswers];

      if (newNumColumns > currentNumColumns) {
        // Add new columns
        for (let i = currentNumColumns; i < newNumColumns; i += 1) {
          updatedColumnLabels.push("");
        }
      } else if (newNumColumns < currentNumColumns) {
        // Remove extra columns
        updatedColumnLabels = updatedColumnLabels.slice(0, newNumColumns);
        // Also need to remove any correct answers that reference removed columns
        updatedCorrectAnswers = updatedCorrectAnswers.filter(
          (coord) => coord[1] < newNumColumns,
        );
      }

      return {
        ...prev,
        columnLabels: updatedColumnLabels,
        correctAnswers: updatedCorrectAnswers,
      };
    });
  };

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
                  href={COURSE_PAGE}
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
                  disabled={isBookmarkLoading}
                >
                  {isCurrentPageBookmarked ? (
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
                    isMultiSelectActivity(activity)) &&
                  (role === "Administrator" ? (
                    <MultipleChoiceMainEditor
                      activity={activity}
                      key={activity.id}
                      setActivity={setActivity}
                      hasImage={hasImage}
                      hasAdditionalContext={hasAdditionalContext}
                    />
                  ) : (
                    <MultipleChoiceViewer
                      activity={activity}
                      onWrongAnswer={() => setIsWrongAnswerModalOpen(true)}
                      key={activity.id}
                      ref={activityViewerRef}
                    />
                  ))}
                {activity &&
                  isTableActivity(activity) &&
                  (role === "Administrator" ? (
                    <TableMainEditor
                      activity={activity}
                      key={activity.id}
                      setActivity={setActivity}
                    />
                  ) : (
                    <TableViewer
                      activity={activity}
                      onWrongAnswer={() => setIsWrongAnswerModalOpen(true)}
                      key={activity.id}
                      ref={activityViewerRef}
                    />
                  ))}
                {activity &&
                  isMatchingActivity(activity) &&
                  (role === "Administrator" ? (
                    <MatchingEditor
                      activity={activity}
                      key={activity.id}
                      setActivity={setActivity}
                    />
                  ) : (
                    <MatchingViewer
                      activity={activity}
                      onWrongAnswer={() => setIsWrongAnswerModalOpen(true)}
                      key={activity.id}
                      ref={activityViewerRef}
                    />
                  ))}
              </Box>
            )}
            {isDidYouLikeTheContentPage && module && (
              <SurveySlides moduleId={module.id} />
            )}
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
            <Box display="flex" gap="12px">
              {role === "Learner" && isActivityPage(currentPageObject) && (
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
                    backgroundColor: theme.palette.Learner.Dark.Default,
                    color: "white",
                  }}
                  onClick={() => {
                    if (isWrongAnswerModalOpen) {
                      setIsWrongAnswerModalOpen(false);
                      activityViewerRef.current?.onRetry?.();
                    } else {
                      activityViewerRef.current?.checkAnswer();
                    }
                  }}
                >
                  {!isWrongAnswerModalOpen && <CheckCircleOutline />}
                  <Typography variant="labelLarge">
                    {isWrongAnswerModalOpen ? "Retry" : "Check Answer"}
                  </Typography>
                  {isWrongAnswerModalOpen && <Refresh />}
                </Button>
              )}
              {role !== "Administrator" && (
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
                    color: theme.palette[role].Dark.Default,
                  }}
                  onClick={() => setIsFullScreen((prev) => !prev)}
                >
                  <FullscreenIcon />
                  <Typography variant="labelLarge">Fullscreen</Typography>
                </Button>
              )}
              {role === "Administrator" && (
                <>
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
                      backgroundColor: theme.palette[role].Dark.Default,
                      color: "white",
                    }}
                    onClick={() => setIsPreviewModalOpen(true)}
                  >
                    <VisibilityOutlined />
                    <Typography variant="labelLarge">Preview</Typography>
                  </Button>
                  <Button
                    sx={{
                      height: "48px",
                      paddingLeft: "16px",
                      paddingRight: "24px",
                      paddingY: "10px",
                      gap: "8px",
                      border: "1px solid",
                      borderColor: theme.palette.Error.Light.Default,
                      borderRadius: "4px",
                      backgroundColor: theme.palette.Error.Light.Default,
                      color: theme.palette.Error.Dark.Default,
                    }}
                    onClick={() => {}}
                  >
                    <DeleteOutline />
                    <Typography variant="labelLarge">Delete Page</Typography>
                  </Button>
                </>
              )}
            </Box>

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
          </Box>
        </Box>
        {currentPageObject && role === "Administrator" && (
          <>
            <Divider orientation="vertical" flexItem />
            {(isMultipleChoiceActivity(currentPageObject) ||
              isMultiSelectActivity(currentPageObject)) && (
              <MultipleChoiceEditorSidebar
                key={currentPageObject.id}
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
                      prev && {
                        ...prev,
                        ...(isMultipleChoiceActivity(prev) ||
                        isMultiSelectActivity(prev)
                          ? { options: [...prev.options, ""] }
                          : {}),
                      },
                  )
                }
                hint={currentPageObject.hint || ""}
                setHint={(newHint: string) => {
                  setActivity((prev) => prev && { ...prev, hint: newHint });
                }}
                isMultiSelect={isMultiSelectActivity(currentPageObject)}
                isAddOptionDisabled={currentPageObject.options.length >= 4}
              />
            )}
            {isTableActivity(currentPageObject) && (
              <TableSidebar
                key={currentPageObject.id}
                numColumns={currentPageObject.columnLabels.length}
                setNumColumns={setNumColumns}
                onAddRow={() =>
                  setActivity((prev) => {
                    if (!prev || !isTableActivity(prev)) return prev;
                    return {
                      ...prev,
                      rowLabels: [...prev.rowLabels, [""]],
                    };
                  })
                }
                isAddRowDisabled={currentPageObject.rowLabels.length >= 6}
                hint={currentPageObject.hint || ""}
                setHint={(newHint: string) => {
                  setActivity((prev) => prev && { ...prev, hint: newHint });
                }}
                // headerColumnIncludes={HeaderColumnIncludesTypes.TEXT}
                // setHeaderColumnIncludes={() => {}}
              />
            )}
            {isMatchingActivity(currentPageObject) && (
              <MatchingSidebar
                key={currentPageObject.id}
                activity={currentPageObject}
                setActivity={setActivity}
                numColumns={Object.keys(currentPageObject.media).length}
                setNumColumns={(newNumColumns: number) => {
                  setActivity((prev) => {
                    if (!prev || !isMatchingActivity(prev)) return prev;
                    const updatedMedia = { ...prev.media };
                    if (newNumColumns === 2) {
                      delete updatedMedia["3"];
                    } else if (newNumColumns === 3) {
                      const newMediaArray: Media[] = Array.from(
                        { length: prev.rows },
                        () => ({ id: "-1", mediaType: "text", context: "" }),
                      );
                      updatedMedia["3"] = newMediaArray;
                    }
                    return {
                      ...prev,
                      media: updatedMedia,
                    };
                  });
                }}
                onAddRow={() =>
                  setActivity((prev) => {
                    if (!prev || !isMatchingActivity(prev)) return prev;
                    const updatedMedia = { ...prev.media };
                    Object.keys(updatedMedia).forEach((key) => {
                      updatedMedia[key] = [
                        ...updatedMedia[key],
                        {
                          id: "-1",
                          mediaType: prev.media[key][0].mediaType,
                          context: "",
                        },
                      ];
                    });
                    return {
                      ...prev,
                      media: updatedMedia,
                      rows: prev.rows + 1,
                    };
                  })
                }
                isAddRowDisabled={false}
                hint={currentPageObject.hint || ""}
                setHint={(newHint: string) => {
                  setActivity((prev) => prev && { ...prev, hint: newHint });
                }}
              />
            )}
          </>
        )}
      </Box>
      <NeedHelpModal
        open={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        module={module}
        currentPage={currentPageObject || null}
      />
      <WrongAnswerModal
        open={isWrongAnswerModalOpen && !isMatchingActivity(currentPageObject)}
        onClose={() => setIsWrongAnswerModalOpen(false)}
        hint={isActivityPage(currentPageObject) ? currentPageObject.hint : ""}
      />
      {isActivityPage(currentPageObject) && (
        <PreviewLearnerModal
          activity={currentPageObject}
          open={isPreviewModalOpen}
          handleClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </Document>
  );
};

export default ViewModulePage;
