/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import MgUser, { Learner, LearnerModel } from "../../../models/user.mgmodel";
import UserService from "../userService";

import { LearnerDTO, UserDTO } from "../../../types/userTypes";

import {
  testActivities,
  testCourseModules,
  testCourseUnits,
  testLearners,
  testLessons,
  testUsers,
} from "../../../__mocks__/mockData";
import coursemoduleMgmodel from "../../../models/coursemodule.mgmodel";
import coursepageMgmodel from "../../../models/coursepage.mgmodel";
import courseunitMgmodel from "../../../models/courseunit.mgmodel";
import db from "../../../testUtils/testDb";

const getLearnerById = async (id: string): Promise<LearnerDTO> => {
  const testUser: Learner | null = await LearnerModel.findById(id);
  expect(testUser).not.toBeNull();
  const testUserDTO: LearnerDTO = testUser!.toObject();
  return testUserDTO;
};

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });

  const storage = jest.fn().mockReturnValue({
    bucket: jest.fn().mockReturnValue({
      file: jest.fn().mockReturnValue({
        save: jest.fn(),
        exists: jest.fn().mockReturnValue([true]),
        delete: jest.fn(),
      }),
      upload: jest.fn(),
    }),
  });

  return { auth, storage };
});

jest.mock("firebase-admin/storage", () => {
  return {
    getDownloadURL: jest.fn().mockReturnValue("https://test.com/image.jpg"),
  };
});

describe("mongo userService", (): void => {
  let userService: UserService;

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    userService = new UserService();
    await MgUser.insertMany(testUsers);
    await courseunitMgmodel.insertMany(testCourseUnits);
    await coursemoduleMgmodel.insertMany(testCourseModules);
    await coursepageMgmodel.insertMany([...testLessons, ...testActivities]);
  });

  afterEach(async () => {
    await db.clear();
  });

  it("getUsers", async () => {
    const res = await userService.getUsers();

    res.forEach((user: UserDTO, i) => {
      expect(user.firstName).toEqual(testUsers[i].firstName);
      expect(user.lastName).toEqual(testUsers[i].lastName);
      expect(user.role).toEqual(testUsers[i].role);
    });
  });

  it("getNumCompletedModules", async () => {
    let testUserDTO = await getLearnerById(testLearners[0]._id);
    const res1 = await userService.getCompletedModules(testUserDTO);

    expect(res1).toEqual(new Set([testCourseModules[0]._id]));

    await userService.addActivityToProgress(
      testLearners[0]._id,
      testCourseUnits[0]._id,
      testCourseModules[1]._id,
      testCourseModules[1].pages[0],
    );

    testUserDTO = await getLearnerById(testLearners[0]._id);
    const res2 = await userService.getCompletedModules(testUserDTO);
    expect(res2).toEqual(
      new Set([testCourseModules[0]._id, testCourseModules[1]._id]),
    );
  });

  it("markActivityCompleted", async () => {
    const updatedLearner = await userService.addActivityToProgress(
      testLearners[0]._id,
      testCourseUnits[0]._id,
      testCourseModules[0]._id,
      testCourseModules[0].pages[0],
    );
    expect(
      updatedLearner?.activitiesCompleted
        .get(testCourseUnits[0]._id.toString())
        ?.get(testCourseModules[0]._id.toString()),
    ).toEqual([new mongoose.Types.ObjectId(testCourseModules[0].pages[0])]);
  });

  it("updateNextPage (next page is in the same module)", async () => {
    const updatedLearner = await userService.updateNextPage(
      testLearners[0]._id,
      {
        unitId: testCourseUnits[1]._id,
        moduleId: testCourseModules[2]._id,
        pageId: testCourseModules[2].pages[0],
      },
    );
    expect(updatedLearner?.nextPage?.toString()).toEqual(
      testCourseModules[2].pages[1].toString(),
    );
  });

  it("updateNextPage (next page is in the next module)", async () => {
    const updatedLearner = await userService.updateNextPage(
      testLearners[0]._id,
      {
        unitId: testCourseUnits[0]._id,
        moduleId: testCourseModules[0]._id,
        pageId: testCourseModules[0].pages[0],
      },
    );
    expect(updatedLearner?.nextPage?.toString()).toEqual(
      testCourseModules[1].pages[0].toString(),
    );
  });

  it("updateNextPage (next page is in the next unit)", async () => {
    const updatedLearner = await userService.updateNextPage(
      testLearners[0]._id,
      {
        unitId: testCourseUnits[0]._id,
        moduleId: testCourseModules[1]._id,
        pageId: testCourseModules[1].pages[0],
      },
    );
    expect(updatedLearner?.nextPage?.toString()).toEqual(
      testCourseModules[2].pages[0].toString(),
    );
  });
});
