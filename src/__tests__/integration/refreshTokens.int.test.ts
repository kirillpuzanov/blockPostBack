import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import { setupApp } from "../../setup-app";
import {
  blackListCollection,
  runDb,
  stopDb,
  testClearDB,
  userCollection,
} from "../../db/database";
import { authService } from "../../auth/application/auth.service";
import { createUserDB } from "../../modules/users/application/utils";
import { bcryptService } from "../../auth/utils/bcrypt.service";
import { UserDb } from "../../modules/users/types/user.types";
import { ResultStatus } from "../../core/types/result";

let user: UserDb & { userId?: string };
const userPass = "12345678";

describe("refreshTokens", () => {
  let mongoServer: MongoMemoryServer;
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await runDb(mongoServer.getUri());
    await testClearDB();

    /** добавляем тестового пользователя в бд */
    const passwordHash = await bcryptService.generateHash(userPass);
    user = createUserDB("test_login", "test_email@gmail.com", passwordHash);
    const createdUser = await userCollection.insertOne(user);
    const userId = createdUser.insertedId.toString();
    user = { ...user, userId };
  });

  afterAll(async () => {
    await testClearDB();
    await stopDb();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should return error 401, if token in blackList", async () => {
    /** логиним тестового пользователя */
    const loginRes = await authService.login({
      password: userPass,
      loginOrEmail: user.login,
    });

    const { refreshToken } = loginRes.data!;
    expect(refreshToken).toBeTruthy();

    /** добавляем его токен в blackList */
    await blackListCollection.insertOne({
      token: refreshToken,
      expireDate: new Date().toISOString(),
    });

    const resRefresh = await authService.refreshTokens(
      refreshToken,
      user.userId!,
    );

    expect(resRefresh.status).toBe(ResultStatus.Unauthorized);
  });

  it("should success refresh and add old token to blackList", async () => {
    /** логиним тестового пользователя */
    const loginRes = await authService.login({
      password: userPass,
      loginOrEmail: user.login,
    });

    const { refreshToken } = loginRes.data!;
    expect(refreshToken).toBeTruthy();

    const resRefresh = await authService.refreshTokens(
      refreshToken,
      user.userId!,
    );

    expect(resRefresh.status).toBe(ResultStatus.Success);
    expect(resRefresh.data?.refreshToken).toBeTruthy();
    expect(resRefresh.data?.accessToken).toBeTruthy();

    /** проверяем, что старый refreshToken отмечен как не валидный */
    const resSecondRefresh = await authService.refreshTokens(
      refreshToken,
      user.userId!,
    );
    expect(resSecondRefresh.status).toBe(ResultStatus.Unauthorized);
  });
});
