import express from "express";
import { setupApp } from "../../setup-app";
import { runDb, stopDb } from "../../db/database";
import request from "supertest";
import { routes } from "../../core/const/routes";
import { HTTP_STATUS } from "../../core/const/statuses";
import { generateAuthHeader } from "../../core/utils/generate-auth-header";
import { MongoMemoryServer } from "mongodb-memory-server";

const newUserData = {
  login: "test_login",
  email: "test_email@gmail.com",
  password: "12345678",
};

describe("login e2e test", () => {
  let mongoServer: MongoMemoryServer;
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await runDb(mongoServer.getUri());
    await request(app).delete(routes.testing);

    /** создаем пользователя для тестов логина */
    await request(app)
      .post(routes.users)
      .set(generateAuthHeader())
      .send(newUserData)
      .expect(HTTP_STATUS.created);
  });

  afterAll(async () => {
    await stopDb();
    await mongoServer.stop();
  });

  it("should return access token, if success login with login name", async () => {
    const loginResult = await request(app)
      .post(routes.auth.login)
      .send({ loginOrEmail: newUserData.login, password: newUserData.password })
      .expect(HTTP_STATUS.ok);
    expect(loginResult.body).toHaveProperty("accessToken");
    expect(loginResult.body.accessToken.split(".")).toHaveLength(3);
  });

  it("should return access token, if success login with email", async () => {
    const loginResult = await request(app)
      .post(routes.auth.login)
      .send({ loginOrEmail: newUserData.email, password: newUserData.password })
      .expect(HTTP_STATUS.ok);
    expect(loginResult.body).toHaveProperty("accessToken");
    expect(loginResult.body.accessToken.split(".")).toHaveLength(3);
  });

  it("should return 400 badRequest, if invalid credentials", async () => {
    const loginResult = await request(app)
      .post(routes.auth.login)
      .send({ loginOrEmail: "", password: newUserData.password })
      .expect(HTTP_STATUS.badRequest);

    expect(loginResult.body).toHaveProperty("errorsMessages");
    expect(loginResult.body.errorsMessages[0].field).toBe("loginOrEmail");
    expect(loginResult.body.errorsMessages[0].message).toBe(
      "incorrect loginOrEmail",
    );

    const loginResultRetry = await request(app)
      .post(routes.auth.login)
      .send({ loginOrEmail: newUserData.email, password: "123" })
      .expect(HTTP_STATUS.badRequest);

    expect(loginResultRetry.body).toHaveProperty("errorsMessages");
    expect(loginResultRetry.body.errorsMessages[0].field).toBe("password");
    expect(loginResultRetry.body.errorsMessages[0].message).toBe(
      "incorrect password",
    );
  });

  it("should return 401, if pass not matched", async () => {
    await request(app)
      .post(routes.auth.login)
      .send({ loginOrEmail: newUserData.email, password: "1234567890" })
      .expect(HTTP_STATUS.unAuthorized);
  });

  it("should return 401, if user not exist", async () => {
    await request(app)
      .post(routes.auth.login)
      .send({
        loginOrEmail: "NF_test_email@gmail.com",
        password: newUserData.password,
      })
      .expect(HTTP_STATUS.unAuthorized);
  });
});
