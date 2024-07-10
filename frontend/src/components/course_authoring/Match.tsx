import React from "react";

interface MatchProps {
  numRows?: number;
  numCols?: number;
}
interface ComponentProps {
  componentData?: MatchProps;
  i: string;
  w: number;
  h: number;
}

const Match: React.FC<ComponentProps> = ({ componentData, i, w, h }) => {
  const { numRows = 0, numCols = 0 } = componentData || {};

  return (
    <div
      className="drag-handle"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <p>
        {w * 50} {h * 50}
      </p>
    </div>
  );
};

export default Match;
