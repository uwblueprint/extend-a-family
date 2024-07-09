import React, { useState } from "react";

interface EditMatchProps {
  componentData: Map<string, object>;
  setComponentData: (data: Map<string, object>) => void;
}

const [value, setValue] = useState<number | null>(0);

const Match: React.FC<EditMatchProps> = () => {
  return (
    <div
      className="drag-handle"
      style={{
        width: "100%",
        height: "100%",
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <p> Match Box </p>
    </div>
  );
};

export default Match;
