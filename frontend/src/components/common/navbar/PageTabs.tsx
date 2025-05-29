import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { HOME_PAGE, BOOKMARKS_PAGE } from "../../../constants/Routes";

const PageTabs = () => {
  const history = useHistory();
  const location = useLocation();

  const isHome = location.pathname === HOME_PAGE;
  const isBookmarks = location.pathname === BOOKMARKS_PAGE;

  return (
    <ButtonGroup>
      <Button
        onClick={() => history.push(HOME_PAGE)}
        variant={isHome ? "contained" : "outlined"}
      >
        Home
      </Button>
      <Button
        onClick={() => history.push(BOOKMARKS_PAGE)}
        variant={isBookmarks ? "contained" : "outlined"}
      >
        Bookmarks
      </Button>
    </ButtonGroup>
  );
};

export default PageTabs;
