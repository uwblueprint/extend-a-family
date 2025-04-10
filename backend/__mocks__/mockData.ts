/* eslint-disable no-underscore-dangle */
import { LearnerDTO, Role, Status } from "../types/userTypes";

export const testLessons = [
  {
    _id: "67e605c6fb8fbc9c9bbb6d81",
    title: "Test Lesson",
    type: "Lesson",
    source: "https://test.com/lesson.pdf",
    pageIndex: 0,
  },
];

export const testActivities = [
  {
    _id: "67e60610fb8fbc9c9bbb6d82",
    title: "Test Activity 1",
    type: "Activity",
    layout: [],
    pageIndex: 0,
  },
  {
    _id: "67e60617fb8fbc9c9bbb6d83",
    title: "Test Activity 2",
    type: "Activity",
    layout: [],
    pageIndex: 1,
  },
];

export const testCourseModules = [
  {
    _id: "67e60622fb8fbc9c9bbb6d84",
    displayIndex: 0,
    title: "Test Course Module 1",
    pages: [testActivities[0]._id],
  },
  {
    _id: "67e60623fb8fbc9c9bbb6d85",
    displayIndex: 1,
    title: "Test Course Module 2",
    pages: [testActivities[1]._id],
  },
];

export const testCourseUnits = [
  {
    _id: "67e6062cfb8fbc9c9bbb6d85",
    displayIndex: 0,
    title: "Test Course Unit",
    modules: testCourseModules.map((module) => module._id),
  },
];

export const testAdmins = [
  {
    firstName: "Peter",
    lastName: "Pan",
    _id: "67e6062ffb8fbc9c9bbb6d86",
    authId: "67e6062ffb8fbc9c9bbb6d87",
    email: "peter.pan@example.com",
    status: "Active" as Status,
    role: "Administrator" as Role,
  },
];

export const testFacilitators = [
  {
    firstName: "Wendy",
    lastName: "Darling",
    _id: "67e60630fb8fbc9c9bbb6d88",
    authId: "67e60631fb8fbc9c9bbb6d89",
    email: "wendy.darling@example.com",
    status: "Active" as Status,
    role: "Facilitator" as Role,
    learners: ["67e60671fb8fbc9c9bbb6d8a"],
  },
];

export const testLearners = [
  {
    firstName: "John",
    lastName: "Doe",
    _id: "67e60671fb8fbc9c9bbb6d8a",
    authId: "67e6068afb8fbc9c9bbb6d8b",
    email: "john.doe@example.com",
    status: "Active" as Status,
    role: "Learner" as Role,
    facilitator: testFacilitators[0]._id,
    activitiesCompleted: {
      [testCourseUnits[0]._id.toString()]: {
        [testCourseModules[0]._id.toString()]: [testActivities[0]._id],
        // testCourseModules[0].pages.map(page => page.toString())
      },
    },
  },
];

export const testLearnersDTO: LearnerDTO[] = [
  {
    firstName: "John",
    lastName: "Doe",
    id: "67e60671fb8fbc9c9bbb6d8a",
    email: "john.doe@example.com",
    status: "Active" as Status,
    role: "Learner" as Role,
    facilitator: testFacilitators[0]._id,
    activitiesCompleted: new Map([
      [
        testCourseUnits[0]._id.toString(),
        new Map([
          [testCourseModules[0]._id.toString(), [testActivities[0]._id]],
        ]),
      ],
    ]),
  },
];

export const testUsers = [...testAdmins, ...testFacilitators, ...testLearners];
