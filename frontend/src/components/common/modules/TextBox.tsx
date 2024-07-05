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
        width: "50%",
        height: "50%",
        alignContent: verticalAlign,
        justifyContent: verticalAlign,
        textAlign: "center",
      }}
    >
      <p style={{ margin: "0px", fontWeight }}>{content}</p>
    </div>
  );
};

export default TextBox;
