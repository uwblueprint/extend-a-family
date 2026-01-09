import { Box, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { useUser } from "../../../hooks/useUser";
import { MatchingActivity, Media } from "../../../types/CourseTypes";
import MatchingBox from "./MatchingBox";

type MatchingViewerProps = {
  activity: MatchingActivity;
  onWrongAnswer: () => void;
  onCorrectAnswer: () => void;
};

export type ActivityViewerHandle = {
  checkAnswer: () => void;
  onRetry?: () => void;
};

const MatchingViewer = React.forwardRef<
  ActivityViewerHandle,
  MatchingViewerProps
>(({ activity, onWrongAnswer, onCorrectAnswer }, ref) => {
  const theme = useTheme();
  const { role: actualRole } = useUser();
  const role = actualRole === "Administrator" ? "Learner" : actualRole;

  const [isDisplayFeedback, setIsDisplayFeedback] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(role === "Facilitator");

  const [selectedLeft, setSelectedLeft] = React.useState<number | null>(null);
  const [selectedMiddle, setSelectedMiddle] = React.useState<number | null>(
    null,
  );
  const [matchesLeftToMid, setMatchesLeftToMid] = React.useState<
    Array<{ leftRowIdx: number; midRowIdx: number }>
  >([]);
  const [matchesMidToRight, setMatchesMidToRight] = React.useState<
    Array<{ midRowIdx: number; rightRowIdx: number }>
  >([]);
  const [lines, setLines] = React.useState<
    Array<{
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      status: "correct" | "wrong" | "neutral";
    }>
  >([]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const leftRefs = React.useRef<Record<number, HTMLDivElement | null>>({});
  const middleRefs = React.useRef<Record<number, HTMLDivElement | null>>({});
  const rightRefs = React.useRef<Record<number, HTMLDivElement | null>>({});

  React.useEffect(() => {
    if (!isCompleted) return;
    const { rows } = activity;
    const hasThirdColumn = Boolean(activity.media["3"]);

    const needsLeft = matchesLeftToMid.length !== rows;
    const needsRight = hasThirdColumn
      ? matchesMidToRight.length !== rows
      : matchesMidToRight.length !== 0;

    if (!needsLeft && !needsRight) return;

    const correctLeftToMid = Array.from({ length: rows }, (_, idx) => ({
      leftRowIdx: idx,
      midRowIdx: idx,
    }));
    const correctMidToRight = hasThirdColumn
      ? Array.from({ length: rows }, (_, idx) => ({
          midRowIdx: idx,
          rightRowIdx: idx,
        }))
      : [];

    setMatchesLeftToMid(correctLeftToMid);
    setMatchesMidToRight(correctMidToRight);
    setIsDisplayFeedback(true);
  }, [
    activity,
    isCompleted,
    matchesLeftToMid.length,
    matchesMidToRight.length,
  ]);

  const checkAnswer = () => {
    const { rows } = activity;
    const hasThirdColumn = Boolean(activity.media["3"]);

    const validatePairs = <T extends { [k: string]: number }>(
      pairs: T[],
      leftKey: keyof T,
      rightKey: keyof T,
    ) => {
      if (pairs.length !== rows) return false;
      const leftSet = new Set<number>();
      const rightSet = new Set<number>();
      let allMatch = true;

      pairs.forEach((pair) => {
        const l = pair[leftKey] as number;
        const r = pair[rightKey] as number;
        if (l !== r) allMatch = false;
        leftSet.add(l);
        rightSet.add(r);
      });

      if (!allMatch) return false;

      return (
        leftSet.size === rows &&
        rightSet.size === rows &&
        Array.from({ length: rows }, (_, idx) => idx).every((idx) => {
          return leftSet.has(idx) && rightSet.has(idx);
        })
      );
    };

    const leftToMidCorrect = validatePairs(
      matchesLeftToMid,
      "leftRowIdx",
      "midRowIdx",
    );

    const midToRightCorrect = hasThirdColumn
      ? validatePairs(matchesMidToRight, "midRowIdx", "rightRowIdx")
      : true;

    if (!leftToMidCorrect || !midToRightCorrect) {
      setIsCompleted(false);
      onWrongAnswer();
      setIsDisplayFeedback(true);
      return;
    }

    // Show fully correct, lock interaction, and render canonical matches
    const correctLeftToMid = Array.from({ length: rows }, (_, idx) => ({
      leftRowIdx: idx,
      midRowIdx: idx,
    }));
    const correctMidToRight = hasThirdColumn
      ? Array.from({ length: rows }, (_, idx) => ({
          midRowIdx: idx,
          rightRowIdx: idx,
        }))
      : [];

    setMatchesLeftToMid(correctLeftToMid);
    setMatchesMidToRight(correctMidToRight);
    setIsCompleted(true);
    setIsDisplayFeedback(true);
    onCorrectAnswer();
  };

  const onRetry = () => {
    setIsDisplayFeedback(false);
    setIsCompleted(false);
    setSelectedLeft(null);
    setSelectedMiddle(null);
    setMatchesLeftToMid([]);
    setMatchesMidToRight([]);
    setLines([]);
  };

  React.useImperativeHandle(ref, () => ({
    checkAnswer,
    onRetry,
  }));

  const shuffleColumn = React.useCallback(
    (array: Media[]): (Media & { rowIdx: number })[] => {
      const withIndex: (Media & { rowIdx: number })[] = array.map(
        (item, index) => ({ ...item, rowIdx: index }),
      );
      for (let i = withIndex.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [withIndex[i], withIndex[j]] = [withIndex[j], withIndex[i]];
      }
      return withIndex;
    },
    [],
  );

  const column1 = React.useMemo(
    () => shuffleColumn(activity.media["1"] || []),
    [activity.media, shuffleColumn],
  );
  const column2 = React.useMemo(
    () => shuffleColumn(activity.media["2"] || []),
    [activity.media, shuffleColumn],
  );
  const column3 = React.useMemo(
    () => shuffleColumn(activity.media["3"] || []),
    [activity.media, shuffleColumn],
  );

  const handleLeftClick = (rowIdx?: number) => () => {
    if (rowIdx === undefined || isDisplayFeedback || isCompleted) return;
    setSelectedLeft((prev) => (prev === rowIdx ? null : rowIdx));
    // clear middle selection when starting a left -> middle match
    setSelectedMiddle(null);
  };

  const handleMiddleClick = (rowIdx?: number) => () => {
    if (rowIdx === undefined || isDisplayFeedback || isCompleted) return;

    if (selectedLeft !== null) {
      setMatchesLeftToMid((prev) => {
        const filtered = prev.filter((pair) => {
          return pair.leftRowIdx !== selectedLeft && pair.midRowIdx !== rowIdx;
        });
        return [...filtered, { leftRowIdx: selectedLeft, midRowIdx: rowIdx }];
      });
      setSelectedLeft(null);
      return;
    }

    setSelectedMiddle((prev) => (prev === rowIdx ? null : rowIdx));
  };

  const handleRightClick = (rowIdx?: number) => () => {
    if (rowIdx === undefined || isDisplayFeedback || isCompleted) return;
    if (selectedMiddle === null) return;

    setMatchesMidToRight((prev) => {
      const filtered = prev.filter((pair) => {
        return pair.midRowIdx !== selectedMiddle && pair.rightRowIdx !== rowIdx;
      });
      return [...filtered, { midRowIdx: selectedMiddle, rightRowIdx: rowIdx }];
    });
    setSelectedMiddle(null);
  };

  React.useLayoutEffect(() => {
    const recalcLines = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      const fromLeftToMid = matchesLeftToMid
        .map((pair) => {
          const leftEl = leftRefs.current[pair.leftRowIdx];
          const midEl = middleRefs.current[pair.midRowIdx];
          if (!leftEl || !midEl) return null;

          const leftRect = leftEl.getBoundingClientRect();
          const midRect = midEl.getBoundingClientRect();

          const x1 = leftRect.right - containerRect.left;
          const y1 = leftRect.top - containerRect.top + leftRect.height / 2;
          const x2 = midRect.left - containerRect.left;
          const y2 = midRect.top - containerRect.top + midRect.height / 2;

          return {
            id: `12-${pair.leftRowIdx}-${pair.midRowIdx}`,
            x1,
            y1,
            x2,
            y2,
            status: pair.leftRowIdx === pair.midRowIdx ? "correct" : "wrong",
          };
        })
        .filter(Boolean) as {
        id: string;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        status: "correct" | "wrong" | "neutral";
      }[];

      const fromMidToRight = matchesMidToRight
        .map((pair) => {
          const midEl = middleRefs.current[pair.midRowIdx];
          const rightEl = rightRefs.current[pair.rightRowIdx];
          if (!midEl || !rightEl) return null;

          const midRect = midEl.getBoundingClientRect();
          const rightRect = rightEl.getBoundingClientRect();

          const x1 = midRect.right - containerRect.left;
          const y1 = midRect.top - containerRect.top + midRect.height / 2;
          const x2 = rightRect.left - containerRect.left;
          const y2 = rightRect.top - containerRect.top + rightRect.height / 2;

          return {
            id: `23-${pair.midRowIdx}-${pair.rightRowIdx}`,
            x1,
            y1,
            x2,
            y2,
            status: pair.midRowIdx === pair.rightRowIdx ? "correct" : "wrong",
          };
        })
        .filter(Boolean) as {
        id: string;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        status: "correct" | "wrong" | "neutral";
      }[];

      const newLines = [...fromLeftToMid, ...fromMidToRight];

      setLines(newLines);
    };

    recalcLines();
    window.addEventListener("resize", recalcLines);
    return () => window.removeEventListener("resize", recalcLines);
  }, [matchesLeftToMid, matchesMidToRight]);

  const isLeftMatched = (rowIdx: number) =>
    matchesLeftToMid.some((pair) => pair.leftRowIdx === rowIdx);
  const isMiddleMatched = (rowIdx: number) =>
    matchesLeftToMid.some((pair) => pair.midRowIdx === rowIdx) ||
    matchesMidToRight.some((pair) => pair.midRowIdx === rowIdx);
  const isRightMatched = (rowIdx: number) =>
    matchesMidToRight.some((pair) => pair.rightRowIdx === rowIdx);

  const getLeftFeedbackStatus = (
    rowIdx?: number,
  ): "correct" | "wrong" | undefined => {
    if (!isDisplayFeedback || rowIdx === undefined || rowIdx === null)
      return undefined;
    const pair = matchesLeftToMid.find((p) => p.leftRowIdx === rowIdx);
    if (!pair) return undefined;
    return pair.leftRowIdx === pair.midRowIdx ? "correct" : "wrong";
  };

  const getMiddleFeedbackStatus = (
    rowIdx?: number,
  ): "correct" | "wrong" | undefined => {
    if (!isDisplayFeedback || rowIdx === undefined || rowIdx === null)
      return undefined;
    const pair = matchesMidToRight.find((p) => p.midRowIdx === rowIdx);
    if (!pair) return undefined;
    return pair.midRowIdx === pair.rightRowIdx ? "correct" : "wrong";
  };

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
            Match each item on the left with the item that goes with it on the
            right.
          </Typography>
        </Box>
        <Box sx={{ position: "relative", width: "100%", flex: 1 }}>
          <svg
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            <defs>
              <marker
                id="matching-arrow-default"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M0 0 L8 4 L0 8 Z"
                  fill={theme.palette[role].Dark.Default}
                />
              </marker>
              <marker
                id="matching-arrow-correct"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M0 0 L8 4 L0 8 Z"
                  fill={theme.palette.Success.Dark.Default}
                />
              </marker>
              <marker
                id="matching-arrow-wrong"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M0 0 L8 4 L0 8 Z"
                  fill={theme.palette.Error.Dark.Default}
                />
              </marker>
            </defs>
            {lines.map((line) => {
              const defaultStroke = theme.palette[role].Dark.Default;
              const correctStroke = theme.palette.Success.Dark.Default;
              const wrongStroke = theme.palette.Error.Dark.Default;

              let strokeColor = defaultStroke;
              let markerId = "matching-arrow-default";

              if (isDisplayFeedback) {
                if (line.status === "correct") {
                  strokeColor = correctStroke;
                  markerId = "matching-arrow-correct";
                } else if (line.status === "wrong") {
                  strokeColor = wrongStroke;
                  markerId = "matching-arrow-wrong";
                }
              }

              return (
                <line
                  key={line.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={strokeColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  markerEnd={`url(#${markerId})`}
                />
              );
            })}
          </svg>

          <Stack
            ref={containerRef}
            direction="column"
            gap="12px"
            sx={{ width: "100%", position: "relative", zIndex: 1 }}
          >
            {Array.from({ length: activity.rows }).map((__, rowIndex) => {
              const leftItem = column1[rowIndex];
              const rightItem = column2[rowIndex];
              const thirdItem = column3[rowIndex];

              return (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  key={rowIndex}
                >
                  <MatchingBox
                    item={leftItem}
                    isSelected={selectedLeft === leftItem?.rowIdx}
                    isMatched={!!leftItem && isLeftMatched(leftItem.rowIdx)}
                    feedbackStatus={getLeftFeedbackStatus(leftItem?.rowIdx)}
                    onClick={handleLeftClick(leftItem?.rowIdx)}
                    registerRef={(node) => {
                      if (leftItem) leftRefs.current[leftItem.rowIdx] = node;
                    }}
                  />
                  <MatchingBox
                    item={rightItem}
                    isSelected={selectedMiddle === rightItem?.rowIdx}
                    isMatched={!!rightItem && isMiddleMatched(rightItem.rowIdx)}
                    feedbackStatus={getMiddleFeedbackStatus(rightItem?.rowIdx)}
                    onClick={handleMiddleClick(rightItem?.rowIdx)}
                    registerRef={(node) => {
                      if (rightItem)
                        middleRefs.current[rightItem.rowIdx] = node;
                    }}
                  />
                  {activity.media["3"] && (
                    <MatchingBox
                      item={thirdItem}
                      isSelected={false}
                      isMatched={
                        !!thirdItem && isRightMatched(thirdItem.rowIdx)
                      }
                      onClick={handleRightClick(thirdItem?.rowIdx)}
                      registerRef={(node) => {
                        if (thirdItem)
                          rightRefs.current[thirdItem.rowIdx] = node;
                      }}
                    />
                  )}
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
});

MatchingViewer.displayName = "MatchingViewer";

export default MatchingViewer;
