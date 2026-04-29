import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import { setupApp } from "../../setup-app";
import { runDb, stopDb, testClearDB, userCollection } from "../../db/database";
import { createUserDB } from "../../modules/users/application/utils";
import { UserDb } from "../../modules/users/types/user.types";
import { ResultStatus } from "../../core/types/result";
import { container } from "../../composition-root";
import { AuthService } from "../../auth/application/auth.service";
import { BcryptService } from "../../auth/utils/bcrypt.service";

const authService = container.get(AuthService);
const bcryptService = container.get(BcryptService);

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

  it("should success refresh and mark old token as invalid", async () => {
    /** логиним тестового пользователя */
    const loginRes = await authService.login({
      password: userPass,
      loginOrEmail: user.login,
      deviceName: "testDeviceName",
      ip: "testIp",
    });

    const { refreshToken } = loginRes.data!;
    expect(refreshToken).toBeTruthy();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const resRefresh = await authService.refreshTokens(refreshToken);

    expect(resRefresh.status).toBe(ResultStatus.Success);
    expect(resRefresh.data?.refreshToken).toBeTruthy();
    expect(resRefresh.data?.accessToken).toBeTruthy();

    /** проверяем, что старый refreshToken отмечен как не валидный */
    const resSecondRefresh = await authService.refreshTokens(refreshToken);
    expect(resSecondRefresh.status).toBe(ResultStatus.Unauthorized);
  });
});
