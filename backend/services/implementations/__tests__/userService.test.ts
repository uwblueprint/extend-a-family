import MgUser, { LearnerModel } from "../../../models/user.mgmodel";
import UserService from "../userService";

import { LearnerDTO, UserDTO } from "../../../types/userTypes";

import mongoose from "mongoose";
import { testActivities, testCourseModules, testCourseUnits, testLearnersDTO, testLessons, testUsers } from "../../../__mocks__/mockData";
import coursemoduleMgmodel from "../../../models/coursemodule.mgmodel";
import coursepageMgmodel from "../../../models/coursepage.mgmodel";
import courseunitMgmodel from "../../../models/courseunit.mgmodel";
import db from "../../../testUtils/testDb";

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
    getDownloadURL: jest.fn().mockReturnValue("https://test.com/image.jpg")
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
    const testUser = testLearnersDTO[0];
    const res = await userService.getNumCompletedModules(testUser);

    expect(res).toEqual(1);
  });

  it("markActivityCompleted", async () => {
    const updatedLearner: LearnerDTO | null = 
      await LearnerModel.findByIdAndUpdate("67e60671fb8fbc9c9bbb6d8a", {
        $addToSet: {
          [`activitiesCompleted.${testCourseUnits[0]._id.toString()}.${testCourseModules[0]._id.toString()}`]: testCourseModules[0].pages[0].toString(),
        },
      }, { new: true });

    expect(updatedLearner?.activitiesCompleted.get(testCourseUnits[0]._id.toString())?.get(testCourseModules[0]._id.toString())).toEqual([new mongoose.Types.ObjectId(testCourseModules[0].pages[0])]);
  });
});
