import db from "../../../testUtils/testDb";
import CourseModuleService from "../courseModuleService";

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

  it("placeholder", async () => {
    expect(true).toBe(true);
  });
});
