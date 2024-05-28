import React from "react";
import TextBox from "./TextBox";

interface BasePrototypeProps {
  name: string;
  layout?: object;
}

const BasePrototype: React.FC<BasePrototypeProps> = ({ name, layout }) => {
  if (name === "text_box1") return <TextBox />;
  if (name === "text_box2") return <TextBox />;
  if (name === "text_box3") return <TextBox />;
  if (name === "text_box4") return <TextBox />;

  return <></>;
};

export default BasePrototype;
