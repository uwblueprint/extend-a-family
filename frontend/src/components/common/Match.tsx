import React from "react";

const Match: React.FC = () => {
  return (
    <div
      className={"drag-handle"}
      style={{
        border: "1px solid black",
        width: "100%",
        height: "100%",
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <p> Match Box </p>
    </div>
  );
};

export default Match;
