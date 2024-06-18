import React, { useRef, useReducer } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DraggableSource from "../common/grid/DraggableSource";
import GridElement from "../common/grid/GridElement";
import layoutReducer from "../common/grid/layoutReducer";

interface LayoutItem extends GridLayout.Layout {
  content: string;
  temp?: boolean;
  mouseEvent?: { clientX: number; clientY: number };
}

const Grid = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [layout, dispatch] = useReducer(layoutReducer, []);

  const gridContainerStyle = {
    backgroundColor: "lightgray",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    width: "601px",
    height: "601px",
    backgroundImage:
      "linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)",
    backgroundSize: "50px 50px",
  };

  return (
    <div
      style={{
        width: "full",
        height: "full",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DraggableSource
        targetRef={ref}
        dispatch={dispatch}
        key="1"
        componentType="TextBox"
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            border: "1px solid blue",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          Text Box - Drag Me !
        </div>
      </DraggableSource>
      <DraggableSource
        targetRef={ref}
        dispatch={dispatch}
        key="2"
        componentType="Match"
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            border: "1px solid blue",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          Match - Drag Me !
        </div>
      </DraggableSource>
      <div ref={ref}>
        <GridLayout
          className="layout"
          style={gridContainerStyle}
          layout={layout}
          onLayoutChange={(layout) => dispatch({ type: "newLayout", layout })}
          cols={12}
          rowHeight={50}
          maxRows={12}
          verticalCompact={false}
          width={600}
          preventCollision={true}
          containerPadding={[0, 0]}
          margin={[0, 0]}
        >
          {layout.map((item) => (
            <div
              key={item.i}
              data-grid={item}
              style={{
                backgroundColor: "white",
                borderTop: "1px solid black",
                borderLeft: "1px solid black",
                boxShadow: "1px 1px 0 0 black, 0 1px 0 0 black", // box alignment
              }}
            >
              <GridElement {...item} componentType={item.content}>
                {item.content}{" "}
              </GridElement>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};

export default Grid;
