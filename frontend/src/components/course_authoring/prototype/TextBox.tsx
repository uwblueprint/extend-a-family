import React from "react";

interface TextBoxProps {
  verticalAlign?: string;
  fontWeight?: string;
  horizontalAlign?: string;
  fontSize?: string;
  content?: string;
}
interface ComponentProps {
  componentData?: TextBoxProps;
}

const TextBox: React.FC<ComponentProps> = ({ componentData }) => {
  const {
    verticalAlign = "center",
    fontWeight = "normal",
    content = "Text Box",
  } = componentData || {};
  return (
    <div
      className="drag-handle"
      style={{
        width: "100%",
        height: "100%",
        alignContent: verticalAlign,
        justifyContent: verticalAlign,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <p style={{ margin: "0px", fontWeight, overflowWrap: "break-word" }}>
        {content}
      </p>
    </div>
  );
};

export default TextBox;
