import React, { useRef, useReducer, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DraggableSource from "../common/grid/DraggableSource";
import GridElement from "../common/grid/GridElement";
import layoutReducer from "../common/grid/layoutReducer";
import BaseComponent from "../course_authoring/BaseComponent";
import ConfirmationModal from "../common/modals/ConfirmationModal";

const CreateModule = () => {
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const [gridLayout, dispatchLayoutAction] = useReducer(layoutReducer, []);
  const [activeItem, setActiveItem] = useState("10000");
  const [isEditMode, setEditMode] = useState(true);
  const [componentDataMap, setComponentDataMap] = useState(
    new Map<string, object>(),
  );
  const [isModalOpen, setModalOpen] = useState(false);

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

  const handleDeleteConfirm = () => {
    dispatchLayoutAction({ type: "deleteItem", i: activeItem });

    const updatedComponentData = new Map(componentDataMap);
    updatedComponentData.delete(activeItem);

    const newComponentData = new Map();
    updatedComponentData.forEach((value, key) => {
      const itemId = parseInt(key, 10);
      const actionId = parseInt(activeItem || "0", 10);
      if (itemId > actionId) {
        newComponentData.set(`${itemId - 1}`, value);
      } else {
        newComponentData.set(key, value);
      }
    });

    setComponentDataMap(newComponentData);
    setModalOpen(false);
    setActiveItem("10000");
  };

  const handleDeleteCancel = () => {
    setModalOpen(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "601px",
          display: "flex",
          height: "110px",
          border: "1px solid black",
          marginTop: "10px",
          marginBottom: "10px",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ position: "absolute", left: "5px", top: "5px" }}>
          <h6>Draggable Components</h6>
        </div>
        <DraggableSource
          targetRef={gridContainerRef}
          dispatch={dispatchLayoutAction}
          key="1"
          componentType="TextComponent"
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
            Text Box
          </div>
        </DraggableSource>
        <div style={{ width: "20px" }} />
        <DraggableSource
          targetRef={gridContainerRef}
          dispatch={dispatchLayoutAction}
          key="2"
          componentType="MatchComponent"
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
            Match
          </div>
        </DraggableSource>
      </div>

      <div
        ref={gridContainerRef}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{ height: "601px", width: "220px", position: "relative" }}
          onClick={() => {
            setEditMode(!isEditMode);
          }}
        >
          {isEditMode ? (
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
            isEditMode
              ? gridContainerStyle
              : { width: "601px", height: "601px", border: "1px solid black" }
          }
          layout={gridLayout}
          onLayoutChange={(newLayout) =>
            dispatchLayoutAction({ type: "newLayout", layout: newLayout })
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
          isDraggable={isEditMode}
          isResizable={isEditMode}
        >
          {gridLayout.map((item) => (
            <div
              key={item.i}
              data-grid={item}
              style={
                isEditMode
                  ? {
                      backgroundColor: "white",
                      borderTop:
                        item.i === activeItem
                          ? "1px solid blue"
                          : "1px solid black",
                      borderLeft:
                        item.i === activeItem
                          ? "1px solid blue"
                          : "1px solid black",
                      boxShadow:
                        item.i === activeItem
                          ? "1px 1px 0 0 blue, 0 1px 0 0 blue"
                          : "1px 1px 0 0 black, 0 1px 0 0 black",
                    }
                  : {}
              }
            >
              <GridElement
                componentType={item.content}
                elementLayoutManifest={{ i: item.i, w: item.w, h: item.h }}
                activeComponent={activeItem}
                setActiveComponent={setActiveItem}
                data={componentDataMap}
                setData={setComponentDataMap}
                temp={item.temp}
                mouseEvent={item.mouseEvent}
                style={item.style}
                className={item.className}
                onMouseDown={item.onMouseDown}
                onMouseUp={item.onMouseUp}
                onTouchEnd={item.onTouchEnd}
                onTouchStart={item.onTouchStart}
                layout={gridLayout}
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
          <div
            style={{
              position: "absolute",
              top: "5px",
              left: "5px",
              right: "5px",
            }}
          >
            <div
              style={{
                width: "200px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h6>Edit Panel</h6>
              {activeItem !== "10000" && (
                <button type="button" onClick={() => setModalOpen(true)}>
                  Delete
                </button>
              )}
            </div>
            <ConfirmationModal
              title="Delete Component"
              message="Are you sure you want to delete this component? This action is not reversible."
              isOpen={isModalOpen}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />
          </div>
          <BaseComponent
            name={`Edit${gridLayout[Number(activeItem)]?.content}` || ""}
            data={componentDataMap}
            activeComponent={activeItem}
            setData={setComponentDataMap}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateModule;
