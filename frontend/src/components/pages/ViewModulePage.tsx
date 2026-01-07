/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Add,
  ArrowCircleDown,
  ArrowCircleUp,
  CheckCircleOutline,
  DeleteOutline,
  HourglassBottom,
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
  Menu,
  MenuItem,
  Snackbar,
  SnackbarContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Document, Page, pdfjs, Thumbnail } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import ActivityAPIClient from "../../APIClients/ActivityAPIClient";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import UserAPIClient from "../../APIClients/UserAPIClient";
import {
  questionTypeIcons,
  questionTypeLabels,
} from "../../constants/ActivityLabels";
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
  QuestionType,
} from "../../types/CourseTypes";
import { Bookmark } from "../../types/UserTypes";
import { padNumber } from "../../utils/StringUtils";
import PreviewLearnerModal from "../course_authoring/editorComponents/PreviewLearnerModal";
import {
  AddYourFirstPageSlide,
  EmptyModuleLeftSidebar,
} from "../course_authoring/EmptyModuleEditing";
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
import DeletePageModal from "./DeletePageModal";
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
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [module, setModule] = useState<CourseModule | null>(null);
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

  const isFeedbackSurveyPage = role === "Learner" && currentPage === numPages;
  const isEmptyModuleEditing =
    role === "Administrator" && module && numPages === 0;

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isWrongAnswerModalOpen, setIsWrongAnswerModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    pageIndex: number;
  } | null>(null);
  const [activityMenuAnchor, setActivityMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [selectedPageIndexForActivity, setSelectedPageIndexForActivity] =
    useState<number | null>(null);
  const [uploadSnackbarOpen, setUploadSnackbarOpen] = useState(false);
  const [uploadSnackbarMessage, setUploadSnackbarMessage] = useState("");
  const [isSnackbarSuccess, setIsSnackbarSuccess] = useState(true);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isDeletingFromContext, setIsDeletingFromContext] = useState(false);

  const [hasImage, setHasImage] = useState(
    (currentPageObject &&
      isActivityPage(currentPageObject) &&
      !!currentPageObject.imageUrl) ||
      false,
  );
  const [hasAdditionalContext, setHasAdditionalContext] = useState(false);

  const { activity, setActivity } = useActivity<Activity>(undefined);

  const activityViewerRef = useRef<ActivityViewerHandle>(null);

  const fetchModule = useCallback(async () => {
    const fetchedModule = await CourseAPIClient.getModuleById(
      requestedModuleId,
    );
    return fetchedModule;
  }, [requestedModuleId]);

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

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
      event.preventDefault();
      setContextMenu((prev) =>
        prev === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
              pageIndex,
            }
          : null,
      );
    },
    [],
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleUploadPdfAbove = () => {
    if (contextMenu === null) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && module) {
        setIsUploadingPdf(true);
        setIsSnackbarSuccess(false);
        setUploadSnackbarMessage("Uploading PDF...");
        setUploadSnackbarOpen(true);
        try {
          const previousPageCount = module.pages.length;
          const updatedModule = await CourseAPIClient.lessonUpload(
            file,
            module.id,
            contextMenu.pageIndex,
          );
          setModule(updatedModule);
          const pagesAdded = updatedModule.pages.length - previousPageCount;
          setIsSnackbarSuccess(true);
          setUploadSnackbarMessage(
            `${pagesAdded} page${pagesAdded !== 1 ? "s" : ""} uploaded`,
          );
        } catch (error) {
          /* eslint-disable-next-line no-console */
          console.error("Failed to upload PDF:", error);
          setUploadSnackbarOpen(false);
        } finally {
          setIsUploadingPdf(false);
        }
      }
    };
    input.click();
    handleCloseContextMenu();
  };

  const handleUploadPdfBelow = () => {
    if (contextMenu === null) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && module) {
        setIsUploadingPdf(true);
        setIsSnackbarSuccess(false);
        setUploadSnackbarMessage("Uploading PDF...");
        setUploadSnackbarOpen(true);
        try {
          const previousPageCount = module.pages.length;
          const updatedModule = await CourseAPIClient.lessonUpload(
            file,
            module.id,
            contextMenu.pageIndex + 1,
          );
          setModule(updatedModule);
          const pagesAdded = updatedModule.pages.length - previousPageCount;
          setIsSnackbarSuccess(true);
          setUploadSnackbarMessage(
            `${pagesAdded} page${pagesAdded !== 1 ? "s" : ""} uploaded`,
          );
        } catch (error) {
          /* eslint-disable-next-line no-console */
          console.error("Failed to upload PDF:", error);
          setUploadSnackbarOpen(false);
        } finally {
          setIsUploadingPdf(false);
        }
      }
    };
    input.click();
    handleCloseContextMenu();
  };

  const handleCreateActivity = (event: React.MouseEvent<HTMLElement>) => {
    if (contextMenu === null) return;
    setSelectedPageIndexForActivity(contextMenu.pageIndex);
    setActivityMenuAnchor(event.currentTarget);
    handleCloseContextMenu();
  };

  const handleActivityTypeSelect = async (questionType: QuestionType) => {
    if (selectedPageIndexForActivity === null || !module) return;
    try {
      const updatedModule = await ActivityAPIClient.createActivity(
        module.id,
        questionType,
        selectedPageIndexForActivity + 1,
      );
      if (updatedModule) {
        setModule(updatedModule);
      }
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error("Failed to create activity:", error);
    }
    setActivityMenuAnchor(null);
    setSelectedPageIndexForActivity(null);
  };

  const handleDeletePageFromContext = async () => {
    if (contextMenu === null || !module) return;
    const pageToDelete = module.pages[contextMenu.pageIndex];
    if (!pageToDelete) return;

    setIsDeletingFromContext(true);
    setIsSnackbarSuccess(false);
    setUploadSnackbarMessage("Deleting page...");
    setUploadSnackbarOpen(true);
    try {
      const deletedPageId = await CourseAPIClient.deletePage(
        module.id,
        pageToDelete.id,
      );

      if (deletedPageId) {
        const refreshedModule = await fetchModule();
        setModule(refreshedModule);

        setCurrentPage((prevPage) => {
          const updatedPagesLength = refreshedModule?.pages.length || 0;
          if (updatedPagesLength === 0) return 0;
          return Math.min(prevPage, updatedPagesLength - 1);
        });
        setIsSnackbarSuccess(true);
        setUploadSnackbarMessage("Page deleted");
      }
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error("Failed to delete page:", error);
      setUploadSnackbarOpen(false);
    } finally {
      setIsDeletingFromContext(false);
    }
    handleCloseContextMenu();
  };

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
  }, [currentPage]);

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

  const handleDeletePage = async () => {
    if (!module || !currentPageObject) return;

    setIsDeleteLoading(true);
    try {
      const deletedPageId = await CourseAPIClient.deletePage(
        module.id,
        currentPageObject.id,
      );

      if (deletedPageId) {
        const refreshedModule = await fetchModule();
        setModule(refreshedModule);

        setCurrentPage((prevPage) => {
          const updatedPagesLength = refreshedModule?.pages.length || 0;
          if (updatedPagesLength === 0) return 0;
          return Math.min(prevPage, updatedPagesLength - 1);
        });
      }
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error("Failed to delete page", error);
    } finally {
      setIsDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const boxHeight = "calc(100vh - 68px)";

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>, index: number) => {
      event.preventDefault();
      if (draggedIndex !== null && draggedIndex !== index) {
        setHoverIndex(index);
      }
    },
    [draggedIndex],
  );

  const handleDragLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  const handleDrop = useCallback(
    async (dropIndex: number) => {
      if (draggedIndex === null || !module) {
        setDraggedIndex(null);
        setHoverIndex(null);
        return;
      }

      try {
        // When dragging down, we need to adjust for the removal of the dragged item
        // which shifts all subsequent indices down by 1
        const adjustedDropIndex =
          draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;

        // Don't proceed if trying to drop in the same position
        if (draggedIndex === adjustedDropIndex) {
          setDraggedIndex(null);
          setHoverIndex(null);
          return;
        }

        setIsSnackbarSuccess(false);
        setUploadSnackbarMessage("Rearranging pages...");
        setUploadSnackbarOpen(true);

        const updatedModule = await CourseAPIClient.reorderPages(
          module.id,
          draggedIndex,
          adjustedDropIndex,
        );
        if (updatedModule) {
          setModule(updatedModule);

          // Update current page if needed
          if (currentPage === draggedIndex) {
            setCurrentPage(adjustedDropIndex);
          } else if (
            draggedIndex < currentPage &&
            adjustedDropIndex >= currentPage
          ) {
            setCurrentPage(currentPage - 1);
          } else if (
            draggedIndex > currentPage &&
            adjustedDropIndex <= currentPage
          ) {
            setCurrentPage(currentPage + 1);
          }

          setIsSnackbarSuccess(true);
          setUploadSnackbarMessage("Pages rearranged");
        }
      } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error("Failed to reorder pages:", error);
        setUploadSnackbarOpen(false);
      } finally {
        setDraggedIndex(null);
        setHoverIndex(null);
      }
    },
    [draggedIndex, module, currentPage],
  );

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
        {isEmptyModuleEditing && <EmptyModuleLeftSidebar />}
        {module?.pages
          .map((page, index) => (
            <ModuleSidebarThumbnail
              key={`thumbnail_${index}`}
              index={index}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              thumbnailRefs={thumbnailRefs}
              isBookmarked={isPageBookmarked(page.id)}
              onContextMenu={
                role === "Administrator" ? handleContextMenu : undefined
              }
              isDraggable={role === "Administrator"}
              onDragStart={
                role === "Administrator" ? handleDragStart : undefined
              }
              onDragOver={role === "Administrator" ? handleDragOver : undefined}
              onDragLeave={
                role === "Administrator" ? handleDragLeave : undefined
              }
              onDrop={role === "Administrator" ? handleDrop : undefined}
              isDragging={draggedIndex === index}
              isDropTarget={hoverIndex === index && draggedIndex !== null}
            >
              {isLessonPage(page) && (
                <Document
                  file={page.pdfUrl}
                  options={options}
                  loading={
                    <Typography variant="bodyMedium">Loading...</Typography>
                  }
                >
                  <Thumbnail
                    pageNumber={page.pageIndex}
                    height={130}
                    scale={1.66}
                  />
                </Document>
              )}
              {isActivityPage(page) && (
                <>
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
                  <Box
                    height={215}
                    width={280}
                    sx={{ backgroundColor: "white" }}
                  />
                </>
              )}
            </ModuleSidebarThumbnail>
          ))
          .concat(
            role === "Learner" ? (
              <ModuleSidebarThumbnail
                key="feedback_thumbnail"
                index={numPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                thumbnailRefs={thumbnailRefs}
              >
                <FeedbackThumbnail />
              </ModuleSidebarThumbnail>
            ) : (
              []
            ),
          )}
        {role === "Administrator" && draggedIndex !== null && module?.pages && (
          <Box
            onDragOver={(e) => {
              e.preventDefault();
              setHoverIndex(module.pages.length);
            }}
            onDragLeave={() => setHoverIndex(null)}
            onDrop={() => handleDrop(module.pages.length)}
            sx={{
              minHeight: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              marginTop: "-10px",
              "&::before":
                hoverIndex === module.pages.length
                  ? {
                      content: '""',
                      position: "absolute",
                      top: "0",
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: theme.palette.Learner.Dark.Default,
                      borderRadius: "2px",
                      zIndex: 10,
                    }
                  : {},
            }}
          />
        )}
      </Box>
    ),
    [
      theme.palette.Neutral,
      theme.palette.Learner.Dark.Default,
      isFullScreen,
      isEmptyModuleEditing,
      module?.pages,
      role,
      numPages,
      currentPage,
      draggedIndex,
      hoverIndex,
      isPageBookmarked,
      handleContextMenu,
      handleDragStart,
      handleDragOver,
      handleDragLeave,
      handleDrop,
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
    <>
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
            {isEmptyModuleEditing && module && (
              <AddYourFirstPageSlide
                moduleId={module.id}
                refreshModule={setModule}
              />
            )}
            {currentPageObject && isLessonPage(currentPageObject) && (
              <Document file={currentPageObject.pdfUrl} options={options}>
                <Page
                  pageNumber={currentPageObject.pageIndex}
                  renderAnnotationLayer={false}
                  scale={getPageScale()}
                  onLoadSuccess={() => handleResize()}
                  inputRef={lessonPageRef}
                />
              </Document>
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
            {isFeedbackSurveyPage && module && (
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
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={isDeleteLoading}
                  >
                    <DeleteOutline />
                    <Typography variant="labelLarge">
                      {isDeleteLoading ? "Deleting..." : "Delete Page"}
                    </Typography>
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
      <DeletePageModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePage}
        isLoading={isDeleteLoading}
      />
      {isActivityPage(currentPageObject) && (
        <PreviewLearnerModal
          activity={currentPageObject}
          open={isPreviewModalOpen}
          handleClose={() => setIsPreviewModalOpen(false)}
        />
      )}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={handleUploadPdfAbove}
          disabled={isUploadingPdf || isDeletingFromContext}
        >
          <Stack direction="row" alignItems="center" gap="12px" paddingY="8px">
            <ArrowCircleUp /> Insert pages above
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={handleUploadPdfBelow}
          disabled={isUploadingPdf || isDeletingFromContext}
        >
          <Stack direction="row" alignItems="center" gap="12px" paddingY="8px">
            <ArrowCircleDown /> Insert pages below
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={handleCreateActivity}
          disabled={isUploadingPdf || isDeletingFromContext}
        >
          <Stack direction="row" alignItems="center" gap="12px" paddingY="8px">
            <Add /> Create activity
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={handleDeletePageFromContext}
          disabled={isUploadingPdf || isDeletingFromContext}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap="12px"
            color={theme.palette.Error.Dark.Default}
            paddingY="8px"
          >
            <DeleteOutline /> Delete page
          </Stack>
        </MenuItem>
      </Menu>
      <Menu
        id="activity-type-menu"
        anchorEl={activityMenuAnchor}
        open={Boolean(activityMenuAnchor)}
        onClose={() => {
          setActivityMenuAnchor(null);
          setSelectedPageIndexForActivity(null);
        }}
        MenuListProps={{
          "aria-labelledby": "activity-type-button",
        }}
      >
        {Object.values(QuestionType).map((type) => (
          <MenuItem key={type} onClick={() => handleActivityTypeSelect(type)}>
            <Stack direction="row" alignItems="center" gap="8px">
              {questionTypeIcons[type]} {questionTypeLabels[type]}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={uploadSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setUploadSnackbarOpen(false)}
        sx={{
          maxWidth: "482px",
          maxHeight: "64px",
          width: "100%",
          height: "100%",
        }}
      >
        <SnackbarContent
          sx={{
            backgroundColor: isSnackbarSuccess
              ? theme.palette.Success.Light.Hover
              : theme.palette.Neutral[200],
            color: theme.palette.Neutral[700],
            paddingTop: "12px",
            paddingLeft: "32px",
            paddingRight: "12px",
            paddingBottom: "12px",
            gap: "16px",
            "& .MuiSnackbarContent-action": {
              padding: "0px",
              margin: "0px",
            },
          }}
          message={
            <span
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              {isSnackbarSuccess ? (
                <CheckCircleOutline
                  sx={{
                    color: theme.palette.Success.Dark.Default,
                  }}
                />
              ) : (
                <HourglassBottom
                  sx={{
                    color: theme.palette.Neutral[700],
                  }}
                />
              )}
              <Typography
                variant="bodyMedium"
                sx={{
                  color: isSnackbarSuccess
                    ? theme.palette.Success.Dark.Default
                    : theme.palette.Neutral[700],
                }}
              >
                {uploadSnackbarMessage}
              </Typography>
            </span>
          }
          action={
            <Button
              size="small"
              onClick={() => setUploadSnackbarOpen(false)}
              sx={{
                color: isSnackbarSuccess
                  ? theme.palette.Success.Dark.Default
                  : theme.palette.Neutral[700],
              }}
            >
              CLOSE
            </Button>
          }
        />
      </Snackbar>
    </>
  );
};

export default ViewModulePage;
