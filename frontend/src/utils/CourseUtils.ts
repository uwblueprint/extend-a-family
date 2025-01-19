import { LayoutItem } from "../components/course_authoring/activity/grid/layoutReducer";
import { ElementData } from "../types/CourseElementTypes";
import { ActivityPage, Element } from "../types/CourseTypes";

// eslint-disable-next-line import/prefer-default-export
export function synthesizeActivityPage(
  targetPage: ActivityPage,
  layout: LayoutItem[],
  elements: Map<string, ElementData>,
): ActivityPage {
  const synthesizedElements: Element[] = layout.map((layoutItem) => ({
    x: layoutItem.x,
    y: layoutItem.y,
    w: layoutItem.w,
    h: layoutItem.h,
    data: elements.get(layoutItem.i),
  }));
  return {
    ...targetPage,
    elements: synthesizedElements,
  };
}
