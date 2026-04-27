import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import { setupApp } from "../../setup-app";
import { runDb, stopDb, testClearDB } from "../../db/database";
import { ResultStatus } from "../../core/types/result";
import { SETTINGS } from "../../core/settings/settings";
import jwt from "jsonwebtoken";
import { authService } from "../../composition-root";

describe("logout", () => {
  let mongoServer: MongoMemoryServer;
  const app = express();
  setupApp(app);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await runDb(mongoServer.getUri());
    await testClearDB();
  });

  afterAll(async () => {
    await testClearDB();
    await stopDb();
    await mongoServer.stop();
  });

  it("should success logout and add refreshToken to blackList", async () => {
    const validToken = jwt.sign(
      { userId: "userId", deviceId: "deviceId" },
      SETTINGS.JWT_SECRET,
      { expiresIn: "20 Sec" },
    );
    /** выполняем logout с валидным токеном */
    const logoutRes = await authService.logout(validToken);
    expect(logoutRes.status).toBe(ResultStatus.NoContent);
  });
});
