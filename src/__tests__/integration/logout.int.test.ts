import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import { setupApp } from "../../setup-app";
import {
  blackListCollection,
  runDb,
  stopDb,
  testClearDB,
} from "../../db/database";
import { authService } from "../../auth/application/auth.service";
import { ResultStatus } from "../../core/types/result";

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

  it("should return error 401, if token in blackList", async () => {
    /** добавляем токен в blackList */
    const invalidToken = {
      token: "invalid-token",
      expireDate: new Date().toISOString(),
    };
    await blackListCollection.insertOne(invalidToken);

    /** пытаемся сделать logout с невалидным старым токеном */
    const logoutRes = await authService.logout(invalidToken.token);

    expect(logoutRes.status).toBe(ResultStatus.Unauthorized);
  });

  it("should success logout and add refreshToken to blackList", async () => {
    const validToken = "valid-token";

    /** выполняем logout с валидным токеном */
    const logoutRes = await authService.logout(validToken);
    expect(logoutRes.status).toBe(ResultStatus.NoContent);

    /** снова выполняем logout с тем же токеном,
     * он уже должен быть добавлен в blackList, после успешного logout  */
    const logoutSecondRes = await authService.logout(validToken);
    expect(logoutSecondRes.status).toBe(ResultStatus.Unauthorized);
  });
});
