import React, { useState } from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";

import BaseModule from "../common/BaseModule";

const ResponsiveGridLayout = WidthProvider(Responsive);

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
  );
};

export default AnalyticsView;
