import React from "react";
import Match from "./Match";
import TextBox from "./TextBox";
import EditTextBox from "./EditTextBox";
import EditMatch from "./EditMatch";

interface BasePrototypeProps {
  name: string;
  activeComponent: string;
  elementLayoutManifest?: { i: string; w: number; h: number };
  data: Map<string, object>;
  setData: (data: Map<string, object>) => void;
}

const BaseModule: React.FC<BasePrototypeProps> = ({
  name,
  data,
  setData,
  activeComponent,
  elementLayoutManifest = { i: "", w: 0, h: 0 },
}) => {
  // Grid items
  if (name === "TextBox")
    return <TextBox componentData={data.get(elementLayoutManifest.i)} />;
  if (name === "Match")
    return (
      <Match
        componentData={data.get(elementLayoutManifest.i)}
        i={elementLayoutManifest.i}
        w={elementLayoutManifest.w}
        h={elementLayoutManifest.h}
      />
    );

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
    return (
      <EditMatch
        componentData={data}
        setComponentData={setData}
        index={activeComponent}
      />
    );
  return <></>;
};

export default BaseModule;
