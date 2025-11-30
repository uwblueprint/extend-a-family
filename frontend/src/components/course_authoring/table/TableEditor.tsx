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
import ActivityAPIClient from "../../../APIClients/ActivityAPIClient";
import {
  Activity,
  isTableActivity,
  TableActivity,
} from "../../../types/CourseTypes";
import VisuallyHiddenInput from "../../common/form/VisuallyHiddenInput";
import DeleteCircleButton from "../editorComponents/DeleteCircleButton";
import TitleEditor from "../editorComponents/TitleEditor";
import {
  BodyMediumTextField,
  BodySmallTextField,
} from "../editorComponents/TypographyTextField";

const TableActivityRow = ({
  index,
  imageURL,
  rowLabel,
  numColumns,
  correctAnswers,
  setActivity,
}: {
  index: number;
  imageURL?: string;
  rowLabel: string;
  numColumns: number;
  correctAnswers: number[][];
  setActivity: React.Dispatch<React.SetStateAction<Activity | undefined>>;
}) => {
  const theme = useTheme();

  const toggleCorrectAnswer = (colIndex: number) => {
    setActivity((prev) => {
      if (!prev || !isTableActivity(prev)) return prev;
      const coordIndex = prev.correctAnswers.findIndex(
        (coord) => coord[0] === index && coord[1] === colIndex,
      );
      const newCorrectAnswers = [...prev.correctAnswers];
      if (coordIndex >= 0) {
        newCorrectAnswers.splice(coordIndex, 1);
      } else {
        newCorrectAnswers.push([index, colIndex]);
      }
      return { ...prev, correctAnswers: newCorrectAnswers };
    });
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
      >
        <Button
          component="label"
          sx={{
            width: 40,
            height: 40,
            minWidth: 40,
            p: 0,
            border: `1px solid ${theme.palette.Neutral[400]}`,
            color: theme.palette.Neutral[800],
          }}
        >
          <VisuallyHiddenInput
            type="file"
            onChange={async (event) => {
              const file: File | undefined = event.target.files?.[0];
              const path = `activity/imageData/matching-${crypto.randomUUID()}`;
              if (file) {
                const uploadedImagePath = await ActivityAPIClient.uploadImage(
                  path,
                  file,
                );
                if (uploadedImagePath) {
                  setActivity((prev) => {
                    if (!prev || !isTableActivity(prev)) return prev;
                    const newRowLabels = [...prev.rowLabels];
                    newRowLabels[index][1] = uploadedImagePath;
                    return { ...prev, rowLabels: newRowLabels };
                  });
                }
              }
            }}
          />
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
          <BodySmallTextField
            defaultValue={rowLabel}
            placeholder="[Row Name]"
            onChange={(newValue) =>
              setActivity((prev) => {
                if (!prev || !isTableActivity(prev)) return prev;
                const newRowLabels = [...prev.rowLabels];
                newRowLabels[index][0] = newValue;

                return { ...prev, rowLabels: newRowLabels };
              })
            }
          />
        </Typography>
      </TableCell>
      {Array.from({ length: numColumns }).map((_, colIndex) => {
        const isCorrect = correctAnswers.some(
          (coord) => coord[0] === index && coord[1] === colIndex,
        );
        return (
          <TableCell
            align="center"
            key={colIndex}
            sx={{ backgroundColor: isCorrect ? "#F5FFDF" : "transparent" }}
            onClick={() => toggleCorrectAnswer(colIndex)}
          >
            {isCorrect ? (
              <CheckBox sx={{ color: theme.palette.Success.Dark.Default }} />
            ) : (
              <CheckBoxOutlineBlank />
            )}
          </TableCell>
        );
      })}
      <TableCell align="center">
        <DeleteCircleButton
          onClick={() =>
            setActivity((prev) => {
              if (!prev || !isTableActivity(prev) || prev.rowLabels.length <= 1)
                return prev;
              const newRowLabels = [...prev.rowLabels];
              newRowLabels.splice(index, 1);

              // shift row indices for answers below the deleted row.
              const newCorrectAnswers = prev.correctAnswers
                // Drop answers that were on the deleted row
                .filter(([r]) => r !== index)
                // Shift rows after the deleted one up by 1
                .map(([r, c]) => (r > index ? [r - 1, c] : [r, c]));

              return {
                ...prev,
                rowLabels: newRowLabels,
                correctAnswers: newCorrectAnswers,
              };
            })
          }
        />
      </TableCell>
    </TableRow>
  );
};

const TableHeadCell = ({
  colSpan = 1,
  value,
  onChange,
}: {
  colSpan?: number;
  value: string;
  onChange: (newValue: string) => void;
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
      <BodyMediumTextField
        defaultValue={value}
        onChange={onChange}
        color="white"
        placeholder="[HEADER]"
      />
    </TableCell>
  );
};

const TableMainEditor = ({
  activity,
  setActivity,
}: {
  activity: TableActivity;
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
            <>
              {activity.columnLabels.map((label, index) => (
                <TableHeadCell
                  key={index}
                  colSpan={index === 0 ? 2 : 1}
                  value={label}
                  onChange={(newValue) => {
                    setActivity((prev) => {
                      if (!prev || !isTableActivity(prev)) return prev;
                      const newColumnLabels = [...prev.columnLabels];
                      newColumnLabels[index] = newValue;
                      return {
                        ...prev,
                        columnLabels: newColumnLabels,
                      };
                    });
                  }}
                />
              ))}
              <TableCell
                sx={{
                  backgroundColor: theme.palette.Learner.Dark.Default,
                  border: `1px solid ${theme.palette.Learner.Dark.Selected}`,
                }}
              />
            </>
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
                correctAnswers={activity.correctAnswers.filter(
                  (coord) => coord[0] === index,
                )}
                setActivity={setActivity}
              />
            ))}
          </TableBody>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TableMainEditor;
