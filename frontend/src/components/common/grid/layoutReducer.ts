import { merge, keyBy } from "lodash";

interface MouseEventLike {
  clientX: number;
  clientY: number;
}

interface LayoutItem {
  x: number;
  y: number;
  h: number;
  w: number;
  content?: string;
  temp?: boolean;
  mouseEvent?: MouseEventLike;
  i: string;
  resizeHandles?: any[];
}

interface LayoutAction {
  type: string;
  h?: number;
  w?: number;
  content?: string;
  mouseEvent?: MouseEventLike;
  layout?: LayoutItem[];
  resizeHandles?: string[];
}

const calculateGridPosition = (mouseEvent, gridTop, gridLeft, cellSize) => {
  const xPos = mouseEvent.clientX - gridLeft;
  const yPos = mouseEvent.clientY - gridTop;

  const cellX = Math.floor(xPos / cellSize);
  const cellY = Math.floor(yPos / cellSize);

  return { cellX, cellY };
};

// Assuming the following values for the grid layout
const gridTop = 100; // Top margin of the grid
const gridLeft = (window.innerWidth - 601) / 2; // Centered grid's left margin
const cellSize = 50; // Size of each cell

const layoutReducer = (
  state: LayoutItem[],
  action: LayoutAction,
): LayoutItem[] => {
  switch (action.type) {
    case "addTemp":
      if (state.findIndex((item) => item.temp) !== -1) {
        return state;
      }

      const { cellX, cellY } = calculateGridPosition(
        action.mouseEvent,
        gridTop,
        gridLeft,
        cellSize,
      );

      console.log("cellX", cellX, "cellY", cellY);
      return [
        ...state,
        {
          x: Math.max(cellX, 0),
          y: Math.max(cellY, 0),
          h: 1,
          w: 1,
          content: action.content
            ? action.content
            : String.fromCharCode(65 + state.length),
          temp: true,
          mouseEvent: action.mouseEvent,
          i: "" + state.length,
          resizeHandles: ["sw", "nw", "se", "ne"],
        },
      ];
    case "clearTemp":
      return state.filter((item) => !item.temp);
    case "finaliseTemporaryItem":
      return state.map((item) => ({ ...item, temp: false }));
    case "newLayout":
      if (state.findIndex((item) => item.temp) !== -1) {
        return state;
      }
      const merged = merge(keyBy(state, "i"), keyBy(action.layout, "i"));
      return Object.values(merged) as LayoutItem[];
    default:
      return state;
  }
};

export default layoutReducer;
