import { Box, Typography, useTheme } from "@mui/material";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import { padNumber } from "../../../utils/StringUtils";

const ModuleSidebarThumbnail = ({
  index,
  currentPage,
  setCurrentPage,
  thumbnailRefs,
  children,
  isBookmarked,
}: {
  index: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  thumbnailRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  children: React.ReactNode;
  isBookmarked?: boolean;
}) => {
  const theme = useTheme();

  return (
    <Box
      key={`thumbnail_${index}`}
      ref={(el: HTMLDivElement | null) => {
        // eslint-disable-next-line no-param-reassign
        if (thumbnailRefs.current) thumbnailRefs.current[index] = el;
      }}
      sx={{
        color:
          index + 1 === currentPage
            ? theme.palette.Learner.Dark.Default
            : "black",
        cursor: "pointer",
        marginBottom: "10px",
        borderRadius: "5px",
        display: "flex",
        justifyItems: "center",
        flexDirection: "row",
        gap: "8px",
      }}
      onClick={() => setCurrentPage(index)}
    >
      <Box
        sx={{
          color:
            index === currentPage
              ? theme.palette.Learner.Dark.Default
              : "black",
        }}
      >
        <Typography
          variant="labelSmall"
          sx={{
            fontWeight: index + 1 === currentPage ? "700" : "300",
            display: "block",
          }}
        >
          {padNumber(index + 1)}
        </Typography>
        {isBookmarked && <BookmarkIcon sx={{ fontSize: "16px" }} />}
      </Box>
      <Box
        sx={{
          position: "relative",
          border:
            currentPage === index
              ? `2px solid ${theme.palette.Learner.Dark.Default}`
              : "none",
          borderRadius: "4px",
          width: "fit-content",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ModuleSidebarThumbnail;
