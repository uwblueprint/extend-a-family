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

const initialItems: LayoutItem[] = [
  { i: "0", x: 0, y: 0, w: 1, h: 2, content: "A" },
  { i: "1", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4, content: "B" },
  { i: "2", x: 4, y: 0, w: 1, h: 2, content: "C" },
];

const Grid = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [layout, dispatch] = useReducer(layoutReducer, initialItems);

  return (
    <div
      style={{
        width: "full",
        height: "full",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DraggableSource targetRef={ref} dispatch={dispatch} key="1">
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "blue",
            border: "1px solid blue",
          }}
        ></div>
      </DraggableSource>
      <DraggableSource targetRef={ref} dispatch={dispatch} key="2">
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "blue",
            border: "1px solid blue",
          }}
        ></div>
      </DraggableSource>
      <div ref={ref}>
        <GridLayout
          className="layout"
          layout={layout}
          onLayoutChange={(layout) => dispatch({ type: "newLayout", layout })}
          cols={12}
          rowHeight={50}
          verticalCompact={false}
          width={600}
          preventCollision={true}
        >
          {layout.map((item) => (
            <div
              key={item.i}
              data-grid={item}
              style={{ border: "1px solid red" }}
            >
              <GridElement {...item}>{item.content}</GridElement>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};

export default Grid;
