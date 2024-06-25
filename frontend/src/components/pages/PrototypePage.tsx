import React, { useRef, useReducer, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DraggableSource from "../common/grid/DraggableSource";
import GridElement from "../common/grid/GridElement";
import layoutReducer from "../common/grid/layoutReducer";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import BaseModule from "../common/modules/BaseModule";

const Grid = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [layout, dispatch] = useReducer(layoutReducer, []);
  const [activeComponent, setActiveComponent] = useState("0");
  const [editMode, setEditMode] = useState(true);
  const [componentData, setComponentData] = useState(new Map<string, object>());

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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "601px",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          height: "110px",
          border: "1px solid black",
          marginTop: "10px",
          marginBottom: "10px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: "5px", top: "5px" }}>
          <h6>Draggable Components</h6>
        </div>
        <br></br>
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
              border: "1px solid black",
              alignItems: "center",
              textAlign: "center",
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
              border: "1px solid black",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            Match
          </div>
        </DraggableSource>
      </div>

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
        <div
          style={{ height: "601px", width: "220px", position: "relative" }}
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          {editMode ? (
            <EyeIcon
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                width: "40px",
                height: "40px",
                cursor: "pointer",
              }}
            />
          ) : (
            <PencilIcon
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                width: "35px",
                height: "35px",
                cursor: "pointer",
              }}
            />
          )}
        </div>
        <GridLayout
          className="layout"
          style={
            editMode
              ? gridContainerStyle
              : { width: "601px", height: "601px", border: "1px solid black" }
          }
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
          isDraggable={editMode}
          isResizable={editMode}
        >
          {layout.map((item) => (
            <div
              key={item.i}
              data-grid={item}
              style={
                editMode
                  ? {
                      backgroundColor: "white",
                      borderTop:
                        item.i == activeComponent
                          ? "1px solid blue"
                          : "1px solid black",
                      borderLeft:
                        item.i == activeComponent
                          ? "1px solid blue"
                          : "1px solid black",
                      boxShadow:
                        item.i == activeComponent
                          ? "1px 1px 0 0 blue, 0 1px 0 0 blue"
                          : "1px 1px 0 0 black, 0 1px 0 0 black", // box alignment
                    }
                  : {}
              }
            >
              <GridElement
                {...item}
                componentType={item.content}
                index={item.i}
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
                componentData={componentData}
                data={componentData.get(item.i) || {}}
                setData={setComponentData}
              >
                {item.content}{" "}
              </GridElement>
            </div>
          ))}
        </GridLayout>
        <div
          style={{
            width: "210px",
            height: "601px",
            border: "1px solid black",
            marginLeft: "10px",
            position: "relative",
          }}
        >
          <h6 style={{ position: "absolute", top: "5px", left: "5px" }}>
            Edit Panel
          </h6>
          <BaseModule
            name={"Edit" + layout[Number(activeComponent)]?.content || ""}
            data={componentData || {}}
            activeComponent={activeComponent}
            setData={setComponentData}
          />
        </div>
      </div>
    </div>
  );
};

export default Grid;
