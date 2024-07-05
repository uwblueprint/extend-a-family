import React, { useState } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";
import TextBox from "./TextBox";

interface MatchProps {
  verticalAlign?: string;
  fontWeight?: string;
  horizontalAlign?: string;
  fontSize?: string;
}
interface ComponentProps {
  componentData?: MatchProps;
}

const Match: React.FC<ComponentProps> = ({ componentData }) => {
  const {
    verticalAlign = "center",
    fontWeight = "normal",
    horizontalAlign = "center",
    fontSize = "14px",
  } = componentData || {};

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<{ [key: string]: string }>({});

  const handleLeftClick = (id: string) => {
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (selectedLeft) {
      setConnections({ ...connections, [selectedLeft]: id });
      setSelectedLeft(null);
    }
  };

  const handleClear = () => {
    setConnections({});
  };

  return (
    <div
      className="drag-handle"
      style={{
        width: "100%",
        height: "100%",
        alignContent: verticalAlign,
        justifyContent: horizontalAlign,
        textAlign: "center",
        fontWeight,
        fontSize,
      }}
    >
      <p style={{ margin: "0px" }}> Match Box </p>
      <ArcherContainer strokeColor="red">
        <div className="match-container" style={{ display: "flex" }}>
          <div className="left-side" style={{ marginRight: "50px" }}>
            {["Left1", "Left2", "Left3"].map((text) => (
              <ArcherElement
                key={text}
                id={text}
                relations={
                  connections[text]
                    ? [
                        {
                          targetId: connections[text],
                          targetAnchor: "left",
                          sourceAnchor: "right",
                        },
                      ]
                    : []
                }
              >
                <div
                  onClick={() => handleLeftClick(text)}
                  style={{
                    padding: "10px",
                    border: "1px solid black",
                    marginBottom: "10px",
                    backgroundColor:
                      selectedLeft === text ? "lightblue" : "white",
                    cursor: "pointer",
                  }}
                >
                  <TextBox />
                </div>
              </ArcherElement>
            ))}
          </div>
          <div className="right-side">
            {["Right1", "Right2", "Right3"].map((text) => (
              <ArcherElement key={text} id={text}>
                <div
                  onClick={() => handleRightClick(text)}
                  style={{
                    padding: "10px",
                    border: "1px solid black",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                >
                  {text}
                </div>
              </ArcherElement>
            ))}
          </div>
        </div>
      </ArcherContainer>
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={handleClear}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Clear Connections
        </button>
      </div>
    </div>
  );
};

export default Match;
