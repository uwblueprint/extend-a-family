import React from "react";
import { Button, useTheme } from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";

interface ExpandCollapseButtonProps {
  allExpanded: boolean;
  onToggle: () => void;
}

const ExpandCollapseButton: React.FC<ExpandCollapseButtonProps> = ({
  allExpanded,
  onToggle,
}) => {
  const theme = useTheme();

  return (
    <Button
      onClick={onToggle}
      startIcon={allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
      sx={{
        color: theme.palette.Neutral[700],
        textTransform: "none",
        fontWeight: 500,
        fontSize: "16px",
        "&:hover": {
          backgroundColor: theme.palette.Neutral[200],
        },
      }}
    >
      {allExpanded ? "Collapse All" : "Expand All"}
    </Button>
  );
};

export default ExpandCollapseButton;
