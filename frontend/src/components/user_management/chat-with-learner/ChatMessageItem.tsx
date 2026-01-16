import { MarkChatReadOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Document, Thumbnail } from "react-pdf";
import { Link } from "react-router-dom";
import { Notification } from "../../../types/NotificationTypes";
import { formatTimeElasped } from "../../../utils/DateUtils";
import { isActivityPage, isLessonPage } from "../../../types/CourseTypes";
import * as Routes from "../../../constants/Routes";
import NotificationAPIClient from "../../../APIClients/NotificationAPIClient";
import { useCourseUnits } from "../../../contexts/CourseUnitsContext";
import { questionTypeIcons } from "../../../constants/ActivityLabels";

export default function ChatMessageItem({
  message,
  refreshNotifs,
}: {
  message: Notification;
  refreshNotifs: () => void;
}) {
  const theme = useTheme();
  const { courseUnits } = useCourseUnits();

  const handleMarkAsRead = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    await NotificationAPIClient.markNotificationRead(message.id);
    refreshNotifs();
  };

  // @ts-expect-error populate gives _id instead of id
  // eslint-disable-next-line no-underscore-dangle
  const unit = courseUnits.find((u) => u.id === message.helpRequest.unit._id);
  const moduleIndex =
    // @ts-expect-error populate gives _id instead of id
    // eslint-disable-next-line no-underscore-dangle
    (unit?.modules.findIndex((m) => m.id === message.helpRequest.module._id) ??
      -1) + 1;
  const pageIndex =
    (message.helpRequest.module.pages.findIndex(
      // @ts-expect-error populate gives _id instead of id
      // eslint-disable-next-line no-underscore-dangle
      (p) => p === message.helpRequest.page._id,
    ) ?? -1) + 1;

  return (
    <Link
      // @ts-expect-error populate gives _id instead of id
      // eslint-disable-next-line no-underscore-dangle
      to={`${Routes.VIEW_PAGE}?moduleId=${message.helpRequest.module._id}&pageId=${message.helpRequest.page._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "24px 16px",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "16px",
          alignSelf: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "28px",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              {!message.read && (
                <Box
                  sx={{
                    display: "flex",
                    width: "13px",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "stretch",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="7"
                    viewBox="0 0 7 7"
                    fill="none"
                  >
                    <circle
                      cx="3.5"
                      cy="3.5"
                      r="3"
                      fill={theme.palette.Facilitator.Dark.Default}
                    />
                  </svg>
                </Box>
              )}
              <Typography variant="bodySmall">
                {formatTimeElasped(message.createdAt)}
              </Typography>
            </Box>
            {!message.read && (
              <IconButton
                size="large"
                sx={{ width: "48px", height: "48px" }}
                onClick={handleMarkAsRead}
              >
                <MarkChatReadOutlined />
              </IconButton>
            )}
          </Box>
          <Typography variant="bodySmall">{message.message}</Typography>
          <Box
            sx={{
              width: "300px",
              height: "183px",
              border: "1px solid",
              borderColor: theme.palette.Neutral[400],
              borderRadius: "7.252px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <>
              <Box
                sx={{
                  width: "100%",
                  height: "156px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLessonPage(message.helpRequest.page) && (
                  <Document
                    file={message.helpRequest.page.pdfUrl}
                    loading="Loading..."
                  >
                    <Thumbnail
                      pageNumber={message.helpRequest.page.pageIndex}
                      width={300}
                    />
                  </Document>
                )}
                {isActivityPage(message.helpRequest.page) &&
                  questionTypeIcons[message.helpRequest.page.questionType]}
              </Box>
              <Box width="100%" height="27px">
                <Typography
                  variant="labelLarge"
                  color={theme.palette.Facilitator.Dark.Default}
                  sx={{ ml: 1 }}
                >
                  MODULE {message.helpRequest.unit.displayIndex}.{moduleIndex}:{" "}
                  {message.helpRequest.module.title} &gt; PAGE {pageIndex}
                </Typography>
              </Box>
            </>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
