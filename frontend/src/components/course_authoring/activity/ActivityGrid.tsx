import React, { useContext } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useTheme } from "@mui/material";
import GridLayout from "react-grid-layout";
import GridElement from "./grid/GridElement";
import CourseAuthoringContext from "../../../contexts/CourseAuthoringContext";
import { ActivityLayoutContext } from "../../../contexts/ActivityLayoutContext";
import { ActivityDataContext } from "../../../contexts/ActivityDataContext";

type ActivityGridProps = {
  rows: number;
  cols: number;
};

const ActivityGrid = ({ rows, cols }: ActivityGridProps) => {
  const { previewMode } = useContext(CourseAuthoringContext);
  const { layout, dispatchLayout, targetRef } = useContext(
    ActivityLayoutContext,
  );
  const { activeElementId } = useContext(ActivityDataContext);
  const theme = useTheme();

  const gridStyle = previewMode
    ? { width: "100%", height: "100%" }
    : {
        width: "100%",
        height: "100%",
        backgroundSize: `${100 / cols}% ${100 / rows}%`,
        backgroundImage: `linear-gradient(to right, ${theme.palette.Neutral[400]} 1px, transparent 1px), 
                          linear-gradient(to bottom, ${theme.palette.Neutral[400]} 1px, transparent 1px)`,
      };
  return (
    <GridLayout
      className="layout"
      style={gridStyle}
      layout={layout}
      onLayoutChange={(newLayout) => {
        dispatchLayout({ type: "newLayout", layout: newLayout });
      }}
      width={targetRef.current?.offsetWidth}
      maxRows={rows}
      cols={cols}
      rowHeight={
        targetRef.current?.offsetHeight &&
        targetRef.current?.offsetHeight / rows
      }
      compactType={null}
      preventCollision
      containerPadding={[0, 0]}
      margin={[0, 0]}
      isDroppable
      isDraggable={!previewMode}
      isResizable={!previewMode}
    >
      {layout.map((item) => (
        <div
          key={item.i}
          data-grid={item}
          style={
            previewMode
              ? {}
              : {
                  backgroundColor: "white",
                  boxSizing: "border-box",
                  borderTop:
                    item.i === activeElementId
                      ? "1px solid blue"
                      : "1px solid black",
                  borderLeft:
                    item.i === activeElementId
                      ? "1px solid blue"
                      : "1px solid black",
                  boxShadow:
                    item.i === activeElementId
                      ? "1px 1px 0 0 blue, 0 1px 0 0 blue"
                      : "1px 1px 0 0 black, 0 1px 0 0 black",
                }
          }
        >
          <GridElement
            elementType={item.content}
            id={item.i}
            temp={item.temp}
            mouseEvent={item.mouseEvent}
            style={item.style}
            className={item.className}
            onMouseDown={item.onMouseDown}
            onMouseUp={item.onMouseUp}
            onTouchEnd={item.onTouchEnd}
            onTouchStart={item.onTouchStart}
          />
        </div>
      ))}
    </GridLayout>
  );
};

export default ActivityGrid;
