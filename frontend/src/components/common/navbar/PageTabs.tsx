import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { Button, Box, useTheme } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { HOME_PAGE, BOOKMARKS_PAGE } from "../../../constants/Routes";

const PageTabs = () => {
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();

  const isHome = location.pathname === HOME_PAGE;
  const isBookmarks = location.pathname === BOOKMARKS_PAGE;

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
    <Box sx={{ display: "flex", gap: "12px" }}>
      <Button
        onClick={() => history.push(HOME_PAGE)}
        startIcon={
          isHome ? (
            <HomeIcon sx={{ width: 24, height: 24 }} />
          ) : (
            <HomeOutlinedIcon sx={{ width: 24, height: 24 }} />
          )
        }
        sx={{
          ...sharedStyle,
          backgroundColor: isHome
            ? theme.palette.NewLearnerLight.Selected
            : "transparent",
          color: isHome
            ? theme.palette.NewLearnerDark.Selected
            : theme.palette.NewLearnerDark.Default,
          "&:hover": {
            backgroundColor: theme.palette.NewLearnerLight.Hover,
            color: theme.palette.NewLearnerDark.Hover,
          },
          "&:active": {
            backgroundColor: theme.palette.Learner.Light,
            color: theme.palette.NewLearnerDark.Pressed,
          },
        }}
      >
        Home
      </Button>

      <Button
        onClick={() => history.push(BOOKMARKS_PAGE)}
        startIcon={
          isBookmarks ? (
            <BookmarkIcon sx={{ width: 24, height: 24 }} />
          ) : (
            <BookmarkBorderOutlinedIcon sx={{ width: 24, height: 24 }} />
          )
        }
        sx={{
          ...sharedStyle,
          backgroundColor: isBookmarks
            ? theme.palette.NewLearnerLight.Selected
            : "transparent",
          color: isBookmarks
            ? theme.palette.NewLearnerDark.Selected
            : theme.palette.NewLearnerDark.Default,
          "&:hover": {
            backgroundColor: theme.palette.NewLearnerLight.Hover,
            color: theme.palette.NewLearnerDark.Hover,
          },
          "&:active": {
            backgroundColor: theme.palette.NewLearnerLight.Pressed,
            color: theme.palette.NewLearnerDark.Pressed,
          },
        }}
      >
        Bookmarks
      </Button>
    </Box>
  );
};

export default PageTabs;
