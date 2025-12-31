import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Box, Button, useTheme } from "@mui/material";

import { useHistory, useLocation } from "react-router-dom";
import {
  BOOKMARKS_PAGE,
  COURSE_PAGE,
  FEEDBACK_PAGE,
  HOME_PAGE,
  MANAGE_USERS_PAGE,
} from "../../../constants/Routes";
import { useUser } from "../../../hooks/useUser";

const NavbarLink = ({
  startIcon,
  active,
  href,
  children,
}: {
  startIcon?: React.ReactNode;
  active: boolean;
  href: string;
  children?: React.ReactNode;
}) => {
  const history = useHistory();
  const theme = useTheme();
  const { role } = useUser();

  const sharedStyle = {
    display: "flex",
    padding: "12px 16px",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px",
    borderRadius: "4px",
    ...theme.typography.bodyMedium,
    fontFamily: theme.typography.fontFamily,
    "& .MuiButton-startIcon": {
      marginRight: "4px",
    },
  };

  return (
    <Button
      onClick={() => history.push(href)}
      startIcon={startIcon}
      sx={{
        ...sharedStyle,
        backgroundColor: active
          ? theme.palette[role].Light.Selected
          : "transparent",
        color: active
          ? theme.palette[role].Dark.Selected
          : theme.palette[role].Dark.Default,
        "&:hover": {
          backgroundColor: theme.palette[role].Light.Hover,
          color: theme.palette[role].Dark.Hover,
        },
        "&:active": {
          backgroundColor: theme.palette[role].Light.Default,
          color: theme.palette[role].Dark.Pressed,
        },
      }}
    >
      {children}
    </Button>
  );
};

const PageTabs = () => {
  const location = useLocation();

  const isHome = location.pathname === HOME_PAGE;
  const isBookmarks = location.pathname === BOOKMARKS_PAGE;
  const isManageUsers = location.pathname === MANAGE_USERS_PAGE;
  const isLibraryPage = location.pathname === COURSE_PAGE;
  const isFeedbackPage = location.pathname.startsWith(FEEDBACK_PAGE);
  const { role } = useUser();

  return (
    <Box sx={{ display: "flex", gap: "12px" }}>
      {role === "Learner" && (
        <>
          <NavbarLink
            active={isHome}
            href={HOME_PAGE}
            startIcon={isHome ? <HomeIcon /> : <HomeOutlinedIcon />}
          >
            Home
          </NavbarLink>
          <NavbarLink
            active={isBookmarks}
            href={BOOKMARKS_PAGE}
            startIcon={
              isBookmarks ? (
                <BookmarkIcon sx={{ width: 24, height: 24 }} />
              ) : (
                <BookmarkBorderOutlinedIcon sx={{ width: 24, height: 24 }} />
              )
            }
          >
            Bookmarks
          </NavbarLink>
        </>
      )}
      {(role === "Facilitator" || role === "Administrator") && (
        <>
          <NavbarLink active={isLibraryPage} href={COURSE_PAGE}>
            Library
          </NavbarLink>
          <NavbarLink active={isFeedbackPage} href={FEEDBACK_PAGE}>
            Feedback
          </NavbarLink>
          <NavbarLink active={isManageUsers} href={MANAGE_USERS_PAGE}>
            {role === "Facilitator" && "Learner List"}
            {role === "Administrator" && "User List"}
          </NavbarLink>
        </>
      )}
    </Box>
  );
};

export default PageTabs;
