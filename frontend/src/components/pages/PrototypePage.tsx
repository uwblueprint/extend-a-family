import React, { useState, useCallback, useEffect } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import map from "lodash/map";
import { twMerge } from "tailwind-merge";

import BaseModule from "../common/BaseModule";

const ResponsiveGridLayout = WidthProvider(Responsive);

const moduleItems = ["text_box1", "text_box2", "text_box3", "text_box4"];

const AnalyticsView = ({
  isDraggable = true,

  breakpoints = {
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
    xs: 0,
  },
  colSizes = {
    xl: 8,
    lg: 6,
    md: 4,
    sm: 3,
    xs: 2,
  },
  preview = false,
}) => {
  // layouts

  type Layout = any;
  type Layouts = any;
  const handleLayoutChange = (layout: Layout, layouts: Layouts) => {
    setModuleLayout(layout);
    setAnalyticsLayoutBreakpoints(layouts);
  };
  const [moduleLayout, setModuleLayout] = useState([]);
  const [moduleLayoutBreakpoints, setAnalyticsLayoutBreakpoints] =
    useState<Layout>([]);

  const generateDOM = () => {
    // use safeLayout to render the items since rendering works with [] by default

    const safeLayout = moduleLayout.length
      ? moduleLayout
      : defaultLayout()["lg"];

    return map(safeLayout, (item, index) => {
      return (
        <div key={item.i} data-grid={null} className="p-1">
          <div>
            <div
              style={{
                backgroundPosition: "center",
                backgroundSize: "cover",

                opacity: 0.8,
              }}
            />
            {
              <div>
                <BaseModule name={item.i} layout={safeLayout[index]} />
              </div>
            }
          </div>
        </div>
      );
    });
  };

  const defaultLayout = () => {
    const juicyLayout = map(moduleItems, function (item, i) {
      // Sexy triangle numbers
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
        h: i == 2 ? 2 : 1,
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

  // const onLayoutChangeCallback = useCallback(handleLayoutChange, []);

  const layoutBreakpoints = moduleLayoutBreakpoints;
  if (layoutBreakpoints === null) {
    return;
  }

  return (
    <div style={{ border: "1px solid black", width: "90%", height: "50%" }}>
      {/* TODO: RENAME THIS TO GENERAL ANALYTICS */}

      <ResponsiveGridLayout
        layouts={layoutBreakpoints}
        onLayoutChange={handleLayoutChange}
        isDraggable={isDraggable}
        isResizable={true}
        rowHeight={160}
        breakpoints={breakpoints}
        cols={colSizes}
        verticalCompact={false}
        draggableHandle=".drag-handle"
      >
        {generateDOM()}
      </ResponsiveGridLayout>
    </div>
  );
};

export default AnalyticsView;
