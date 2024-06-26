import MgUser from "../../../models/user.mgmodel";
import UserService from "../userService";

import { UserDTO } from "../../../types/userTypes";

import db from "../../../testUtils/testDb";

const testUsers = [
  {
    firstName: "Peter",
    lastName: "Pan",
    authId: "123",
    role: "Administrator",
  },
  {
    firstName: "Wendy",
    lastName: "Darling",
    authId: "321",
    role: "Facilitator",
  },
];

jest.mock("firebase-admin", () => {
  const auth = jest.fn().mockReturnValue({
    getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
  });
  return { auth };
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
  });

  afterEach(async () => {
    await db.clear();
  });

  it("getUsers", async () => {
    await MgUser.insertMany(testUsers);

    const res = await userService.getUsers();

    res.forEach((user: UserDTO, i) => {
      expect(user.firstName).toEqual(testUsers[i].firstName);
      expect(user.lastName).toEqual(testUsers[i].lastName);
      expect(user.role).toEqual(testUsers[i].role);
    });
  });
});
