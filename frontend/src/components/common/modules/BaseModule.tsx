import React from "react";
import Match from "./Match";
import TextBox from "./TextBox";
import EditTextBox from "./EditTextBox";
import EditMatch from "./EditMatch";

interface BasePrototypeProps {
  name: string;
  activeComponent: string;
  data: any;
  setData: (data: Map<string, object>) => void;
}

const BaseModule: React.FC<BasePrototypeProps> = ({
  name,
  data,
  setData,
  activeComponent,
}) => {
  // Grid items
  if (name === "TextBox") return <TextBox componentData={data} />;
  if (name === "Match") return <Match componentData={data} />;

  // Corresponding edit panel
  if (name === "EditTextBox")
    return (
      <EditTextBox
        componentData={data}
        setComponentData={setData}
        index={activeComponent}
      />
    );
  if (name === "EditMatch")
    return <EditMatch componentData={data} setComponentData={setData} />;
  return <></>;
};

export default BaseModule;
