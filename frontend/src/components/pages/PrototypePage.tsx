import React, { useRef, useReducer, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DraggableSource from "../common/grid/DraggableSource";
import GridElement from "../common/grid/GridElement";
import layoutReducer from "../common/grid/layoutReducer";
import { act } from "react-test-renderer";
import { set } from "lodash";

const Grid = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [layout, dispatch] = useReducer(layoutReducer, []);
  const [activeComponent, setActiveComponent] = useState("0");

  const gridContainerStyle = {
    backgroundColor: "lightgray",
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
      <div style={{ display: "flex" }}>
        <DraggableSource
          targetRef={ref}
          dispatch={dispatch}
          key="1"
          componentType="TextBox"
        >
          <div
            style={{
              width: "70px",
              height: "30px",
              border: "1px solid blue",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            Text Box
          </div>
        </DraggableSource>
        <div style={{ width: "20px" }}></div>
        <DraggableSource
          targetRef={ref}
          dispatch={dispatch}
          key="2"
          componentType="Match"
        >
          <div
            style={{
              width: "70px",
              height: "30px",
              border: "1px solid blue",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            Match
          </div>
        </DraggableSource>
      </div>
      <div style={{ height: "50px" }}></div>
      <div
        ref={ref}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <GridLayout
          className="layout"
          style={gridContainerStyle}
          layout={layout}
          onLayoutChange={(layout) => dispatch({ type: "newLayout", layout })}
          cols={12}
          rowHeight={50}
          maxRows={12}
          compactType={null}
          width={600}
          preventCollision={true}
          containerPadding={[0, 0]}
          margin={[0, 0]}
          isDroppable={true}
        >
          {layout.map((item) => (
            <div
              key={item.i}
              data-grid={item}
              style={{
                backgroundColor: "white",
                borderTop:
                  item.i == activeComponent
                    ? "2px solid blue"
                    : "1px solid black",
                borderLeft:
                  item.i == activeComponent
                    ? "2px solid blue"
                    : "1px solid black",
                boxShadow:
                  item.i == activeComponent
                    ? "2px 2px 0 0 blue, 0 2px 0 0 blue"
                    : "1px 1px 0 0 black, 0 1px 0 0 black", // box alignment
              }}
            >
              <GridElement
                {...item}
                componentType={item.content}
                index={item.i}
                setActiveComponent={setActiveComponent}
              >
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
