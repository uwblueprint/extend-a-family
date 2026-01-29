import db from "../../../testUtils/testDb";

describe("courseModuleService", (): void => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  afterEach(async () => {
    await db.clear();
  });
});
