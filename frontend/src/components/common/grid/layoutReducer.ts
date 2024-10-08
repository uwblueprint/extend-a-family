import { merge, keyBy } from "lodash";

interface MouseEventLike {
  clientX: number;
  clientY: number;
}

type ResizeHandle = "sw" | "nw" | "se" | "ne" | "n" | "s" | "w" | "e";
interface LayoutItem {
  x: number;
  y: number;
  h: number;
  w: number;
  content?: string;
  temp?: boolean;
  mouseEvent?: MouseEventLike;
  i: string;
  resizeHandles?: ResizeHandle[];
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
}

interface LayoutAction {
  type: string;
  h?: number;
  w?: number;
  content?: string;
  mouseEvent?: MouseEventLike;
  layout?: LayoutItem[];
  i?: string;
  resizeHandles?: string[];
}

const calculateGridPosition = (
  mouseEvent: MouseEventLike | undefined,
  gridTop: number,
  gridLeft: number,
  cellSize: number,
) => {
  if (!mouseEvent) {
    return { cellX: 0, cellY: 0 };
  }

  const xPos = mouseEvent.clientX - gridLeft;
  const yPos = mouseEvent.clientY - gridTop;

  const cellX = Math.floor(xPos / cellSize);
  const cellY = Math.floor(yPos / cellSize);

  return { cellX, cellY };
};

const gridTop = 100; // Top margin of the grid
const gridLeft = (window.innerWidth - 601) / 2; // Centered grid's left margin, where 601 is the width of the grid
const cellSize = 50; // Size of each cell

const layoutReducer = (
  state: LayoutItem[],
  action: LayoutAction,
): LayoutItem[] => {
  switch (action.type) {
    case "addTemp": {
      if (state.findIndex((item) => item.temp) !== -1) {
        return state;
      }

      const { cellX, cellY } = calculateGridPosition(
        action.mouseEvent,
        gridTop,
        gridLeft,
        cellSize,
      );
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
          i: `${state.length}`, // Unique ID, but can cause future issues when deleting items
          resizeHandles: ["sw", "nw", "se", "ne"],
        },
      ];
    }
    case "clearTemp":
      return state.filter((item) => !item.temp);
    case "finaliseTemporaryItem":
      return state.map((item) => ({ ...item, temp: false }));
    case "newLayout": {
      if (state.findIndex((item) => item.temp) !== -1) {
        return state;
      }
      const merged = merge(keyBy(state, "i"), keyBy(action.layout, "i"));
      return Object.values(merged) as LayoutItem[];
    }
    case "deleteItem": {
      const updatedState = state
        .filter((item) => item.i !== action.i)
        .map((item) => {
          const itemId = parseInt(item.i, 10);
          const actionId = parseInt(action.i || "0", 10);
          if (itemId > actionId) {
            return { ...item, i: `${itemId - 1}` };
          }
          return item;
        });
      return updatedState;
    }
    default:
      return state;
  }
};

export default layoutReducer;
