import express, { Express } from "express";
import { setupApp } from "../../setup-app";
import { authSessionsCollection, runDb, stopDb } from "../../db/database";
import request from "supertest";
import { routes } from "../../core/const/routes";
import { HTTP_STATUS } from "../../core/const/statuses";
import { generateAuthHeader } from "../../core/utils/generate-auth-header";
import { MongoMemoryServer } from "mongodb-memory-server";

import { jwtService } from "../../composition-root";

/** отключаем  rateLimitGuard */
jest.mock("../../auth/validation/rate-limit.guard", () => ({
  rateLimitGuard: jest.fn((req, res, next) => next()),
}));

const newUserData = {
  login: "test_login",
  email: "test_email@gmail.com",
  password: "12345678",
};

const userDevices = [
  {
    ip: "122.3.122",
    ua: "Googlebot/2.1 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
    refreshToken: "",
  },
  {
    ip: "122.3.123",
    ua: "Googlebot/2.2 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
    refreshToken: "",
  },
  {
    ip: "122.3.124",
    ua: "Googlebot/2.3 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
    refreshToken: "",
  },
];

const loginAllDevices = async (app: Express) => {
  const promises = [];
  for (const { ip, ua } of userDevices) {
    const res = request(app)
      .post(routes.auth.login)
      .send({
        loginOrEmail: newUserData.login,
        password: newUserData.password,
      })
      .set("X-Real-IP", ip)
      .set("X-Forwarded-For", userDevices[0].ip)
      .set("User-Agent", ua);
    promises.push(res);
  }

  const results = await Promise.all(promises);
  results.forEach((el, i) => {
    userDevices[i].refreshToken = el.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];
  });
};

describe("session e2e test", () => {
  let mongoServer: MongoMemoryServer;
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await runDb(mongoServer.getUri());
    await request(app).delete(routes.testing);
    /** создаем пользователя в БД */
    await request(app)
      .post(routes.users)
      .set(generateAuthHeader())
      .send(newUserData)
      .expect(HTTP_STATUS.created);
  });

  afterEach(async () => {
    await authSessionsCollection.deleteMany();
  });

  afterAll(async () => {
    await stopDb();
    await mongoServer.stop();
  });

  it("should return number of user active sessions", async () => {
    await loginAllDevices(app);

    /** залогинили 3 устройства пользователя, проверили что есть 3 сессии*/
    const sessionsCount = await authSessionsCollection.countDocuments();
    expect(sessionsCount).toBe(3);
  });

  it("should success refreshToken first device", async () => {
    await loginAllDevices(app);

    /** ожидание для обновления токена в БД */
    await new Promise((resolve) => setTimeout(resolve, 1000));

    /** обновляем токен первого девайса, проверили что также 3 сессии */

    const refreshResult = await request(app)
      .post(routes.auth.refreshToken)
      .set("Cookie", `refreshToken=${userDevices[0].refreshToken}`);

    expect(refreshResult.status).toBe(200);

    const session = await authSessionsCollection.find({}).toArray();
    expect(session).toHaveLength(3);
  });

  it("should success delete all device session", async () => {
    await loginAllDevices(app);
    const sessionsCount = await authSessionsCollection.countDocuments();
    expect(sessionsCount).toBe(3);

    /** удаляем все сессии кроме текущей */
    const deleteResult = await request(app)
      .delete(routes.deviceSessions)
      .set("Cookie", `refreshToken=${userDevices[0].refreshToken}`);

    expect(deleteResult.status).toBe(204);

    const session = await authSessionsCollection.find({}).toArray();
    expect(session).toHaveLength(1);
  });

  it("should success delete one device session", async () => {
    await loginAllDevices(app);

    /** получаем deviceId второго устройства */
    const secondDeviceId = jwtService.decodeRefreshToken(
      userDevices[1].refreshToken,
    ).deviceId;

    /** удаляем сессию второго устройства */
    const deleteResult = await request(app)
      .delete(routes.deviceSessions + `/${secondDeviceId}`)
      .set("Cookie", `refreshToken=${userDevices[0].refreshToken}`);

    expect(deleteResult.status).toBe(204);

    const session = await authSessionsCollection.find({}).toArray();
    expect(session).toHaveLength(2);

    /** проверяем что сессия не активна */
    const refreshResult = await request(app)
      .post(routes.auth.refreshToken)
      .set("Cookie", `refreshToken=${userDevices[1].refreshToken}`);

    expect(refreshResult.status).toBe(401);
  });

  it("should return forbidden error, if delete not your session ", async () => {
    /** создаем второго пользователя */
    const newUserResult = await request(app)
      .post(routes.users)
      .set(generateAuthHeader())
      .send({
        login: "test",
        email: "test_2_email@gmail.com",
        password: "12345671",
      })
      .expect(HTTP_STATUS.created);

    /** логиним его  */
    const loginRes = await request(app)
      .post(routes.auth.login)
      .send({
        loginOrEmail: "test",
        password: "12345671",
      })
      .set("X-Real-IP", "123-123-123")
      .set("X-Forwarded-For", "123-123-123")
      .set("User-Agent", "test");

    const newUserRefreshToken = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

    await loginAllDevices(app);

    /** получаем deviceId первого устройства */
    const firstDeviceId = jwtService.decodeRefreshToken(
      userDevices[1].refreshToken,
    ).deviceId;

    /** пытаемся удалить чужую сессию */
    const deleteResult = await request(app)
      .delete(routes.deviceSessions + `/${firstDeviceId}`)
      .set("Cookie", `refreshToken=${newUserRefreshToken}`);

    expect(deleteResult.status).toBe(403);
  });
});
