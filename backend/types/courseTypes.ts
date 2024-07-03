import { Module } from "../models/courseunit.mgmodel";

export type CourseUnitDTO = {
  id: string;
  displayIndex: number;
  title: string;
  modules: [Module];
};

export type CreateCourseUnitDTO = Omit<
  CourseUnitDTO,
  "id" | "modules" | "displayIndex"
>;

export type UpdateCourseUnitDTO = Omit<
  CourseUnitDTO,
  "id" | "modules" | "displayIndex"
>;
