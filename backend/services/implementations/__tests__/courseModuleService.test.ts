import { ObjectId } from "mongodb";
import CourseModuleService from "../courseModuleService";
import db from "../../../testUtils/testDb";

describe("courseModuleService", (): void => {
  let courseModuleService: CourseModuleService;

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    courseModuleService = new CourseModuleService();
  });

  afterEach(async () => {
    await db.clear();
  });

  it("uploadLessons", async () => {
    const res = await courseModuleService.uploadLessons(
      new ObjectId().toHexString(),
      "uploads/",
    );
    // eslint-disable-next-line no-console
    console.log("Result:", res);
  }, 20_000);
});
