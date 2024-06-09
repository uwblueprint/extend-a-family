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
}

interface LayoutAction {
  type: string;
  h?: number;
  w?: number;
  content?: string;
  mouseEvent?: MouseEventLike;
  layout?: LayoutItem[];
}

const layoutReducer = (
  state: LayoutItem[],
  action: LayoutAction,
): LayoutItem[] => {
  switch (action.type) {
    case "addTemp":
      if (state.findIndex((item) => item.temp) !== -1) {
        return state;
      }
      const maxX = state.reduce(
        (val, item) => (item.x + item.h > val ? item.x + item.h : val),
        0,
      );
      const maxY = state.reduce(
        (val, item) => (item.y + item.w > val ? item.y + item.w : val),
        0,
      );
      return [
        ...state,
        {
          x: 1,
          y: 1,
          h: action.h ? action.h : 1,
          w: action.w ? action.w : 1,
          content: action.content
            ? action.content
            : String.fromCharCode(65 + state.length),
          temp: true,
          mouseEvent: action.mouseEvent,
          i: "" + state.length,
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
