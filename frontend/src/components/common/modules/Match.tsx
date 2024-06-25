import React from "react";

interface MatchProps {
  verticalAlign: string;
  fontWeight: string;
  horizontalAlign: string;
  fontSize: string;
}
interface ComponentProps {
  componentData: MatchProps;
}

const Match: React.FC<ComponentProps> = ({ componentData }) => {
  const {
    verticalAlign = "center",
    fontWeight = "normal",
    horizontalAlign = "center",
    fontSize = "14px",
  } = componentData;
  return (
    <div
      className={"drag-handle"}
      style={{
        width: "100%",
        height: "100%",
        alignContent: verticalAlign,
        justifyContent: horizontalAlign,
        textAlign: "center",
        fontWeight: fontWeight,
        fontSize: fontSize,
      }}
    >
      <p> Match Box </p>
    </div>
  );
};

export default Match;
