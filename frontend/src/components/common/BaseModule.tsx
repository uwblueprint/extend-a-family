import React from "react";
import TextBox from "./TextBox";
import Match from '../common/Match';
interface BasePrototypeProps {
  name: string;
  layout?: object;
}

const BasePrototype: React.FC<BasePrototypeProps> = ({ name, layout }) => {
  if (name === "text_box") return <TextBox />;
  if (name === "text_box2") return <TextBox />;
  if (name === "text_box3") return <TextBox />;
  if (name === "text_box4") return <TextBox />;
  if (name === "text_box5") return <TextBox />;
  if (name === "match") return <Match />;

  return <></>;
};

export default BasePrototype;
