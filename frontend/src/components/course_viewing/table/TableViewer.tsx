import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import {
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { TableActivity } from "../../../types/CourseTypes";
import { useUser } from "../../../hooks/useUser";

type TableViewerProps = {
  activity: TableActivity;
  onWrongAnswer: () => void;
  onCorrectAnswer: () => void;
};

export type ActivityViewerHandle = {
  checkAnswer: () => void;
};

const TableActivityRow = ({
  index,
  imageURL,
  rowLabel,
  numColumns,
  correctAnswers,
  selectedAnswers,
  setSelectedAnswers,
  isCompleted,
}: {
  index: number;
  imageURL?: string;
  rowLabel: string;
  numColumns: number;
  correctAnswers: number[][];
  selectedAnswers: number[][];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<number[][]>>;
  isCompleted: boolean;
}) => {
  const theme = useTheme();

  const toggleSelected = (colIndex: number) => {
    if (isCompleted) return;
    const coordIndex = selectedAnswers.findIndex(
      (coord) => coord[0] === index && coord[1] === colIndex,
    );
    const newSelectedAnswers = [...selectedAnswers];
    if (coordIndex >= 0) {
      newSelectedAnswers.splice(coordIndex, 1);
    } else {
      newSelectedAnswers.push([index, colIndex]);
    }
    setSelectedAnswers(newSelectedAnswers);
  };

  return (
    <TableRow>
      <TableCell
        align="center"
        sx={{
          backgroundImage: `url(${imageURL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <TableCell
        align="center"
        sx={{
          borderLeft: `1px solid ${theme.palette.Neutral[400]}`,
          borderRight: `1px solid ${theme.palette.Neutral[400]}`,
        }}
      >
        <Typography variant="bodySmall">
          <Typography variant="bodySmall">{rowLabel}</Typography>
        </Typography>
      </TableCell>
      {Array.from({ length: numColumns }).map((_, colIndex) => {
        const displayCorrect =
          isCompleted &&
          correctAnswers.some(
            (coord) => coord[0] === index && coord[1] === colIndex,
          );
        const isSelected = selectedAnswers.some(
          (coord) => coord[0] === index && coord[1] === colIndex,
        );
        return (
          <TableCell
            align="center"
            key={colIndex}
            sx={{ backgroundColor: displayCorrect ? "#F5FFDF" : "transparent" }}
            onClick={() => toggleSelected(colIndex)}
          >
            {isSelected || displayCorrect ? (
              <CheckBox
                sx={{
                  color: displayCorrect
                    ? theme.palette.Success.Dark.Default
                    : theme.palette.Learner.Dark.Default,
                }}
              />
            ) : (
              <CheckBoxOutlineBlank />
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

const TableHeadCell = ({
  colSpan = 1,
  value,
}: {
  colSpan?: number;
  value: string;
}) => {
  const theme = useTheme();
  return (
    <TableCell
      align="center"
      sx={{
        backgroundColor: theme.palette.Learner.Dark.Default,
        border: `1px solid ${theme.palette.Learner.Dark.Selected}`,
        color: "white",
      }}
      colSpan={colSpan}
    >
      <Typography variant="bodyMedium">{value}</Typography>
    </TableCell>
  );
};

const TableViewer = React.forwardRef<ActivityViewerHandle, TableViewerProps>(
  ({ activity, onWrongAnswer, onCorrectAnswer }, ref) => {
    const theme = useTheme();
    const { role } = useUser();

    const [selectedAnswers, setSelectedAnswers] = React.useState<number[][]>(
      [],
    );
    const [isCompleted, setIsCompleted] = React.useState(
      role === "Facilitator",
    );

    const isAnswerCorrect = () => {
      const { correctAnswers } = activity;
      if (selectedAnswers.length !== correctAnswers.length) {
        return false;
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const coord of correctAnswers) {
        const found = selectedAnswers.find(
          (selectedCoord) =>
            selectedCoord[0] === coord[0] && selectedCoord[1] === coord[1],
        );
        if (!found) {
          return false;
        }
      }
      return true;
    };

    const checkAnswer = () => {
      if (!isAnswerCorrect()) {
        onWrongAnswer();
      } else {
        onCorrectAnswer();
        setIsCompleted(true);
      }
    };

    React.useImperativeHandle(ref, () => ({
      checkAnswer,
    }));

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
            <Typography variant="titleLarge">{activity.title}</Typography>
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
              {activity.columnLabels.map((label, index) => (
                <TableHeadCell
                  key={index}
                  colSpan={index === 0 ? 2 : 1}
                  value={label}
                />
              ))}
            </TableHead>
            <TableBody
              sx={{
                "& .MuiTableRow-root:nth-of-type(odd)": {
                  backgroundColor: theme.palette.Neutral[200],
                },
              }}
            >
              {activity.rowLabels.map(([rowLabel, imageURL], index) => (
                <TableActivityRow
                  key={index}
                  index={index}
                  rowLabel={rowLabel}
                  imageURL={imageURL}
                  numColumns={activity.columnLabels.length - 1}
                  isCompleted={isCompleted}
                  correctAnswers={activity.correctAnswers}
                  selectedAnswers={selectedAnswers}
                  setSelectedAnswers={setSelectedAnswers}
                />
              ))}
            </TableBody>
          </TableContainer>
        </Box>
      </Box>
    );
  },
);

TableViewer.displayName = "TableViewer";

export default TableViewer;
