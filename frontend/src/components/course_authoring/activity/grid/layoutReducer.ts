import { merge, keyBy } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { ElementPosition } from "../../../../types/CourseElementTypes";

interface MouseEventLike {
  clientX: number;
  clientY: number;
}

type ResizeHandle = "sw" | "nw" | "se" | "ne" | "n" | "s" | "w" | "e";
export interface LayoutItem extends ElementPosition {
  i: string;
  elementType?: string;
  temp?: boolean;
  mouseEvent?: MouseEventLike;
  resizeHandles?: ResizeHandle[];
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
}

export interface LayoutAction {
  type: string;
  h?: number;
  w?: number;
  elementType?: string;
  mouseEvent?: MouseEventLike;
  layout?: LayoutItem[];
  i?: string;
  resizeHandles?: string[];
}

const calculateGridPosition = (
  mouseEvent: MouseEventLike | undefined,
  cellSize: number,
) => {
  if (!mouseEvent) {
    return { cellX: 0, cellY: 0 };
  }

  const xPos = mouseEvent.clientX;
  const yPos = mouseEvent.clientY;

  const cellX = Math.floor(xPos / cellSize);
  const cellY = Math.floor(yPos / cellSize);

  return { cellX, cellY };
};

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
        cellSize,
      );
      return [
        ...state,
        {
          x: Math.max(cellX, 0),
          y: Math.max(cellY, 0),
          h: 2,
          w: 3,
          elementType: action.elementType ?? "",
          temp: true,
          mouseEvent: action.mouseEvent,
          i: uuidv4(),
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
      const updatedState = state.filter((item) => item.i !== action.i);
      return updatedState;
    }
    case "reset": {
      return [];
    }
    default:
      return state;
  }
};

export default layoutReducer;
