<<<<<<< Updated upstream
import React, { useState } from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
=======
import React, { useRef, useReducer } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DraggableSource from "../common/grid/DraggableSource";
import GridElement from "../common/grid/GridElement";
import layoutReducer from "../common/grid/layoutReducer";
>>>>>>> Stashed changes

interface LayoutItem extends GridLayout.Layout {
  content: string;
  temp?: boolean;
  mouseEvent?: { clientX: number; clientY: number };
}

const initialItems: LayoutItem[] = [
  { i: "0", x: 0, y: 0, w: 1, h: 2, static: true, content: "A" },
  { i: "1", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4, content: "B" },
  { i: "2", x: 4, y: 0, w: 1, h: 2, content: "C" },
];

<<<<<<< Updated upstream
const AnalyticsView = () => {
  const moduleItems = ["text_box", "text_box", "text_box", "text_box"];
  const [layout, setLayout] = useState<Layout[]>([]);
  const [layoutBreakpoints, setLayoutBreakpoints] = useState<Layouts>();

  const handleLayoutChange = (newLayout: Layout[], newLayouts: Layouts) => {
    setLayout(newLayout);
    setLayoutBreakpoints(newLayouts);
  };

  const defaultLayout = () => {
    const juicyLayout = moduleItems.map((item, i) => {
      let level = 0;
      let total = 0;

      while (total < i) {
        level++;
        total = (level * (level + 1)) / 2;
      }

      const offset = i - (level * (level - 1)) / 2;

      return {
        x: (level - offset) * 2,
        y: offset,
        w: 2,
        h: i === 2 ? 2 : 1,
        i: item,
      };
    });

    const allBreakpoints = {
      xl: juicyLayout,
      lg: juicyLayout,
      md: juicyLayout,
      sm: juicyLayout,
      xs: juicyLayout,
    };

    return allBreakpoints;
  };

  const generateDOM = () => {
    const safeLayout = layout.length > 0 ? layout : defaultLayout().lg;

    return safeLayout.map((item) => (
      <div
        key={item.i}
        className="grid-item"
        style={{ border: "1px solid black", height: "100%" }}
      >
        <BaseModule name={item.i} layout={item} />
      </div>
    ));
  };

  return (
    <>
      <div
        style={{
          border: "1px solid black",
          width: "1200px",
          height: "700px",
          overflow: "hidden",
        }}
      >
        <ResponsiveGridLayout
          className="layout"
          layouts={layoutBreakpoints}
          onLayoutChange={handleLayoutChange}
          isResizable={true}
          isDraggable={true}
          autoSize={false}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 4, md: 4, sm: 4, xs: 4, xxs: 2 }}
          margin={[10, 10]}
          containerPadding={[10, 10]}
          compactType="vertical"
          transformScale={1}
          verticalCompact={false}
          width={1200}
          rowHeight={500}
          maxRows={140}
        >
          {generateDOM()}
        </ResponsiveGridLayout>
      </div>
    </>
=======
const Grid = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [layout, dispatch] = useReducer(layoutReducer, initialItems);

  return (
    <div>
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
          rowHeight={30}
          width={1200}
        >
          {layout.map((item) => (
            <div key={item.i} data-grid={item}>
              <GridElement style={{ border: "1px solid red" }} {...item}>
                {item.content}
              </GridElement>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
>>>>>>> Stashed changes
  );
};

export default Grid;
