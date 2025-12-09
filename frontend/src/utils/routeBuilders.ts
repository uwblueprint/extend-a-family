import * as Routes from "../constants/Routes";

export type ViewPageParams = {
  unitId: string;
  moduleId: string;
  pageId?: string;
};

export function buildViewPageUrl(params: ViewPageParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set("unitId", params.unitId);
  searchParams.set("moduleId", params.moduleId);
  if (params.pageId) searchParams.set("pageId", params.pageId);
  return `${Routes.VIEW_PAGE}?${searchParams.toString()}`;
}
