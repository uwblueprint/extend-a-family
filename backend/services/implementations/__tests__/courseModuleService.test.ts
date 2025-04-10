import db from "../../../testUtils/testDb";

describe("courseModuleService", (): void => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {});

  afterEach(async () => {
    await db.clear();
  });

  it("placeholder", async () => {
    expect(true).toBe(true);
  });
});
