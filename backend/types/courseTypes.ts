export type CourseUnitDTO = {
  id: string;
  displayIndex: number;
  title: string;
};

export type CreateCourseUnitDTO = Omit<
  CourseUnitDTO,
  "id" | "modules" | "displayIndex"
>;

export type UpdateCourseUnitDTO = Omit<
  CourseUnitDTO,
  "id" | "modules" | "displayIndex"
>;
