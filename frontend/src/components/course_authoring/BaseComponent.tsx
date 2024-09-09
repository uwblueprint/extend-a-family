import React from "react";
import TextComponent from "./TextComponent";
import MatchComponent from "./MatchComponent";
import TextPanel from "./TextPanel";
import MatchPanel from "./MatchPanel";

interface BasePrototypeProps {
  name: string;
  activeComponent: string;
  elementLayoutManifest?: { i: string; w: number; h: number };
  data: Map<string, object>;
  setData: (data: Map<string, object>) => void;
}

const BaseComponent: React.FC<BasePrototypeProps> = ({
  name,
  data,
  setData,
  activeComponent,
  elementLayoutManifest = { i: "", w: 0, h: 0 },
}) => {
  switch (name) {
    case "TextComponent":
      return (
        <TextComponent componentData={data.get(elementLayoutManifest.i)} />
      );
    case "MatchComponent":
      return (
        <MatchComponent
          componentData={data}
          setComponentData={setData}
          i={elementLayoutManifest.i}
          w={elementLayoutManifest.w}
          h={elementLayoutManifest.h}
        />
      );
    case "EditTextComponent":
      return (
        <TextPanel
          componentData={data}
          setComponentData={setData}
          index={activeComponent}
        />
      );
    case "EditMatchComponent":
      return (
        <MatchPanel
          componentData={data}
          setComponentData={setData}
          index={activeComponent}
        />
      );
    default:
      return null;
  }
};

export default BaseComponent;
