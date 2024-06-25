import React from "react";

interface TextBoxProps {
  verticalAlign: string;
  fontWeight: string;
  horizontalAlign: string;
  fontSize: string;
}
interface ComponentProps {
  componentData: TextBoxProps;
}

const TextBox: React.FC<ComponentProps> = ({ componentData }) => {
  const {
    verticalAlign = "center",
    fontWeight = "normal",
    horizontalAlign = "center",
    fontSize,
  } = componentData;
  return (
    <div
      className={"drag-handle"}
      style={{
        width: "100%",
        height: "100%",
        alignContent: verticalAlign,
        justifyContent: "flex-start",
        textAlign: "center",
      }}
    >
      <p style={{ fontWeight: fontWeight }}> Text Box </p>
    </div>
  );
};

export default TextBox;
