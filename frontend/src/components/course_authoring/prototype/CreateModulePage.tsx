import React, { useRef, useReducer, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DraggableSource from "../../common/grid/DraggableSource";
import GridElement from "../../common/grid/GridElement";
import layoutReducer from "../../common/grid/layoutReducer";
import BaseModule from "./BaseModule";
import ConfirmationModal from "../../common/modals/ConfirmationModal";

const CreateModule = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [layout, dispatch] = useReducer(layoutReducer, []);
  const [activeComponent, setActiveComponent] = useState("10000"); // Arbitrary number that will never be an index, allows us to call Number() without error
  const [editMode, setEditMode] = useState(true);
  const [componentData, setComponentData] = useState(new Map<string, object>());
  const [isModalOpen, setModalOpen] = useState(false);

  const gridContainerStyle = {
    backgroundColor: "lightgray",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    width: "601px",
    height: "601px",
    backgroundImage:
      "linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)", // Grid lines
    backgroundSize: "50px 50px",
  };

  const handleDeleteConfirm = () => {
    dispatch({ type: "deleteItem", i: activeComponent });

    // We re-index items in layoutReducer, so we need to update mappings to component data
    const updatedComponentData = new Map(componentData);
    updatedComponentData.delete(activeComponent);

    const newComponentData = new Map();
    updatedComponentData.forEach((value, key) => {
      const itemId = parseInt(key, 10);
      const actionId = parseInt(activeComponent || "0", 10);
      if (itemId > actionId) {
        newComponentData.set(`${itemId - 1}`, value);
      } else {
        newComponentData.set(key, value);
      }
    });

    setComponentData(newComponentData);
    setModalOpen(false);
    setActiveComponent("10000"); // Reset active component after deletion
  };

  const handleDeleteCancel = () => {
    setModalOpen(false);
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
        <br />
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
              backgroundColor: "white",
              zIndex: 1000,
            }}
          >
            {" "}
            Text Box
          </div>
        </DraggableSource>
        <div style={{ width: "20px" }} />
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
              backgroundColor: "white",
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
          zIndex: 1,
        }}
      >
        <div
          style={{ height: "601px", width: "220px", position: "relative" }}
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          {editMode ? (
            <VisibilityIcon
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
            <ModeEditIcon
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
          onLayoutChange={(newLayout) =>
            dispatch({ type: "newLayout", layout: newLayout })
          }
          cols={12}
          rowHeight={50}
          maxRows={12}
          compactType={null}
          width={600}
          preventCollision
          containerPadding={[0, 0]}
          margin={[0, 0]}
          isDroppable
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
                        item.i === activeComponent
                          ? "1px solid blue"
                          : "1px solid black",
                      borderLeft:
                        item.i === activeComponent
                          ? "1px solid blue"
                          : "1px solid black",
                      boxShadow:
                        item.i === activeComponent
                          ? "1px 1px 0 0 blue, 0 1px 0 0 blue"
                          : "1px 1px 0 0 black, 0 1px 0 0 black", // Box alignment, 1px solid black border does not work
                    }
                  : {}
              }
            >
              <GridElement
                componentType={item.content}
                index={item.i}
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
                data={componentData}
                setData={setComponentData}
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
        <div
          style={{
            width: "210px",
            height: "601px",
            border: "1px solid black",
            marginLeft: "10px",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: "5px", left: "5px" }}>
            <h6>Edit Panel</h6>
            {activeComponent !== "10000" && (
              <button type="button" onClick={() => setModalOpen(true)}>
                Delete
              </button>
            )}
            <ConfirmationModal
              title="Delete Component"
              message="Are you sure you want to delete this component? This action is not reversible."
              isOpen={isModalOpen}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />
          </div>
          <BaseModule
            name={`Edit${layout[Number(activeComponent)]?.content}` || ""}
            data={componentData}
            activeComponent={activeComponent}
            setData={setComponentData}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateModule;
