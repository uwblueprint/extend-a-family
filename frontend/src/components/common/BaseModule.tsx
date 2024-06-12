import React from "react";
import Match from "../common/Match";
import TextBox from "./modules/TextBox";
interface BasePrototypeProps {
  name: string;
}

const BaseModule: React.FC<BasePrototypeProps> = ({ name }) => {
  if (name === "TextBox") return <TextBox />;
  if (name === "Match") return <Match />;
  return <></>;
};

export default BaseModule;
