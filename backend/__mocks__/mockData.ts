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
  {
    _id: "67e60618fb8fbc9c9bbb6d84",
    title: "Test Activity 3",
    type: "Activity",
    layout: [],
    pageIndex: 2,
  },
  {
    _id: "67e60619fb8fbc9c9bbb6d85",
    title: "Test Activity 4",
    type: "Activity",
    layout: [],
    pageIndex: 3,
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
  {
    _id: "67e60624fb8fbc9c9bbb6d86",
    displayIndex: 2,
    title: "Test Course Module 3",
    pages: [testActivities[2]._id, testActivities[3]._id],
  },
];

export const testCourseUnits = [
  {
    _id: "67e6062cfb8fbc9c9bbb6d85",
    displayIndex: 0,
    title: "Test Course Unit 1",
    modules: [testCourseModules[0]._id, testCourseModules[1]._id],
  },
  {
    _id: "67e6062dfb8fbc9c9bbb6d86",
    displayIndex: 1,
    title: "Test Course Unit 2",
    modules: [testCourseModules[2]._id],
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
    bookmarks: [],
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
    bookmarks: [],
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
      },
    },
    bookmarks: [],
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
    bookmarks: [],
  },
];

export const testUsers = [...testAdmins, ...testFacilitators, ...testLearners];
