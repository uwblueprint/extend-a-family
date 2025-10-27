import {
  AddPhotoAlternateOutlined,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import {
  Box,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { Activity } from "../../../types/CourseTypes";
import BodySmallTextField from "../editorComponents/BodySmallTextField";
import DeleteCircleButton from "../editorComponents/DeleteCircleButton";
import TitleEditor from "../editorComponents/TitleEditor";

const TableActivityRow = () => {
  const theme = useTheme();
  return (
    <TableRow>
      <TableCell align="center">
        <Button
          sx={{
            width: 40,
            height: 40,
            minWidth: 40,
            p: 0,
            border: `1px solid ${theme.palette.Neutral[400]}`,
            color: theme.palette.Neutral[800],
          }}
        >
          <AddPhotoAlternateOutlined
            sx={{ color: theme.palette.Neutral[800] }}
          />
        </Button>
      </TableCell>
      <TableCell
        align="center"
        sx={{
          borderLeft: `1px solid ${theme.palette.Neutral[400]}`,
          borderRight: `1px solid ${theme.palette.Neutral[400]}`,
        }}
      >
        <Typography variant="bodySmall">
          <BodySmallTextField value="[Row Name]" onChange={() => {}} />
        </Typography>
      </TableCell>
      <TableCell align="center">
        <CheckBoxOutlineBlank />
      </TableCell>
      <TableCell align="center" sx={{ backgroundColor: "#F5FFDF" }}>
        <CheckBox sx={{ color: theme.palette.Success.Dark.Default }} />
      </TableCell>
      <TableCell align="center">
        <CheckBoxOutlineBlank />
      </TableCell>
      <TableCell align="center">
        <CheckBoxOutlineBlank />
      </TableCell>
      <TableCell align="center">
        <DeleteCircleButton onClick={() => {}} />
      </TableCell>
    </TableRow>
  );
};

const TableHeadCell = ({
  colSpan = 1,
  children,
}: {
  colSpan?: number;
  children?: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <TableCell
      align="center"
      sx={{
        backgroundColor: theme.palette.Learner.Dark.Default,
        border: `1px solid ${theme.palette.Learner.Dark.Selected}`,
      }}
      colSpan={colSpan}
    >
      <Typography variant="bodyMedium" sx={{ color: "white" }}>
        {children}
      </Typography>
    </TableCell>
  );
};

const TableMainEditor = ({
  activity,
  setActivity,
}: {
  activity: Activity;
  setActivity: React.Dispatch<React.SetStateAction<Activity | undefined>>;
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: "582px",
        padding: "0 32px 0 33px",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",

        borderRadius: "8px",
        border: `1px solid ${theme.palette.Neutral[400]}`,
        background: theme.palette.Neutral[100],
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "705px",
          height: "582px",
          padding: "24px 0",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "36px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "705px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <TitleEditor
            title={activity.title}
            setTitle={(newTitle) => {
              setActivity((prev) => prev && { ...prev, title: newTitle });
            }}
          />
          <Typography
            variant="bodyMedium"
            sx={{ color: theme.palette.Neutral[500] }}
          >
            Pick the box or boxes that show the right answer for that row.
          </Typography>
        </Box>
        <TableContainer
          sx={{
            border: `1px solid ${theme.palette.Neutral[400]}`,
            width: "fit-content",
          }}
        >
          <TableHead
            sx={{
              backgroundColor: theme.palette.Learner.Dark.Default,
            }}
          >
            <TableHeadCell colSpan={2}>[HEADER]</TableHeadCell>
            <TableHeadCell>[HEADER]</TableHeadCell>
            <TableHeadCell>[HEADER]</TableHeadCell>
            <TableHeadCell>[HEADER]</TableHeadCell>
            <TableHeadCell>[HEADER]</TableHeadCell>
            <TableHeadCell />
          </TableHead>
          <TableBody
            sx={{
              "& .MuiTableRow-root:nth-of-type(odd)": {
                backgroundColor: theme.palette.Neutral[200],
              },
            }}
          >
            <TableActivityRow />
            <TableActivityRow />
            <TableActivityRow />
            <TableActivityRow />
          </TableBody>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TableMainEditor;
