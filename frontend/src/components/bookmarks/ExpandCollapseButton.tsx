import React from "react";
import { Button, useTheme } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
      startIcon={
        <ArrowDropDownIcon
          sx={{
            width: "18px",
            height: "18px",
            transition: "transform 0.25s ease",
            transform: allExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      }
      sx={{
        display: "inline-flex",
        width: "168px",
        height: "40px",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        borderRadius: "4px",

        backgroundColor: theme.palette.Learner.Dark.Default,
        color: "#FFF",

        boxShadow: "0 1px 2px rgba(0,0,0,0.30), 0 1px 3px 1px rgba(0,0,0,0.15)",

        font: theme.typography.labelMedium,

        "& .MuiButton-startIcon": {
          marginRight: 0,
        },

        "&:hover": {
          backgroundColor: theme.palette.Learner.Dark.Hover,
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.30), 0 2px 6px 1px rgba(0,0,0,0.18)",
        },
      }}
    >
      {allExpanded ? "Collapse All" : "Expand All"}
    </Button>
  );
};

export default ExpandCollapseButton;
