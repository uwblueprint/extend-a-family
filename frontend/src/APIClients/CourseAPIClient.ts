import { LayoutItem } from "../components/course_authoring/activity/grid/layoutReducer";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { ElementData } from "../types/CourseElementTypes";
import { ActivityPage, CoursePage, CourseUnit } from "../types/CourseTypes";
import { synthesizeActivityPage } from "../utils/CourseUtils";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import baseAPIClient from "./BaseAPIClient";

const getUnits = async (): Promise<CourseUnit[]> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    const { data } = await baseAPIClient.get("/course/", {
      headers: { Authorization: bearerToken },
    });
    return data;
  } catch (error) {
    return [];
  }
};

const saveActivityPage = async (
  unitId: string,
  moduleId: string,
  activePage: ActivityPage,
  layout: LayoutItem[],
  elements: Map<string, ElementData>,
): Promise<CoursePage> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  const page = synthesizeActivityPage(activePage, layout, elements);

  // Existing page id => update page
  if (activePage.id) {
    const { data } = await baseAPIClient.put(
      `/course/${unitId}/${moduleId}/${activePage.id}`,
      page,
      {
        headers: { Authorization: bearerToken },
      },
    );
    return data;
  }

  // Missing page id => create page
  const { data } = await baseAPIClient.post(
    `/course/${unitId}/${moduleId}`,
    page,
    {
      headers: { Authorization: bearerToken },
    },
  );
  return data;
};

export default { getUnits, saveActivityPage };
