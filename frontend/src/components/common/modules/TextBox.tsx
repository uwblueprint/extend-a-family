import React from "react";

const TextBox: React.FC = () => {
  return (
    <div
      className={"drag-handle"}
      style={{
        width: "100%",
        height: "100%",
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <p> Text Box </p>
    </div>
  );
};

export default TextBox;
