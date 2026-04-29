import express from "express";
import { MongoMemoryServer } from "mongodb-memory-server";

import { setupApp } from "../../setup-app";
import { runDb, stopDb, testClearDB, userCollection } from "../../db/database";
import { ResultStatus } from "../../core/types/result";
import { createUserDB } from "../../modules/users/application/utils";
import { MailService } from "../../auth/utils/mail.service";
import { container } from "../../composition-root";
import { AuthService } from "../../auth/application/auth.service";

const mockMailService = {
  sendMail: jest.fn().mockImplementation(() => Promise.resolve()),
} as unknown as MailService;

container.rebind(MailService).toConstantValue(mockMailService);

const authService = container.get(AuthService);

describe("registration", () => {
  let mongoServer: MongoMemoryServer;

  const app = express();
  setupApp(app);

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await runDb(mongoServer.getUri());
    await testClearDB();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await testClearDB();
    await stopDb();
    await mongoServer.stop();
  });

  describe("user registration", () => {
    const registerUserCase = authService.registration.bind(authService);

    it("should return BadRequest, if email or login not unique", async () => {
      /** создаем пользователя в БД */
      const existingUser = createUserDB(
        "test_login",
        "test_email@gmail.com",
        "12345678",
      );
      await userCollection.insertOne(existingUser);

      /** отправили уже существующий email */
      const resBadEmail = await registerUserCase(
        "12345678",
        existingUser.email,
        "simple",
      );
      expect(resBadEmail.status).toBe(ResultStatus.BadRequest);
      expect(resBadEmail.extensions[0]).toEqual({
        field: "email",
        message: "this email already registered",
      });

      /** отправили уже существующий login */
      const resBadLogin = await registerUserCase(
        "12345678",
        "test11@test.com",
        existingUser.login,
      );

      expect(resBadEmail.status).toBe(ResultStatus.BadRequest);
      expect(resBadLogin.extensions[0]).toEqual({
        field: "login",
        message: "this login already registered",
      });

      expect(mockMailService.sendMail).not.toHaveBeenCalled();
    });

    it("should create user with correct data", async () => {
      const newUserData = {
        login: "Login",
        email: "test@gmail.com",
        password: "12345678",
      };
      const result = await registerUserCase(
        newUserData.password,
        newUserData.email,
        newUserData.login,
      );

      expect(result.status).toBe(ResultStatus.NoContent);

      expect(mockMailService.sendMail).toHaveBeenCalledWith(
        newUserData.email,
        expect.any(String),
        expect.any(Function),
      );

      /** проверяем что юзер создался, с isConfirmed - false */
      const createdUsers = await userCollection.find({}).toArray();

      expect(createdUsers[1].login).toBe(newUserData.login);
      expect(createdUsers[1].email).toBe(newUserData.email);
      expect(createdUsers[1].emailConfirmation.isConfirmed).toBe(false);
    });
  });

  describe("user confirm registration", () => {
    const registrationConfirmCase =
      authService.registrationConfirm.bind(authService);

    it("should return error badRequest, if user with specific code does not exist", async () => {
      const result = await registrationConfirmCase("any confirm code");
      expect(result.status).toBe(ResultStatus.BadRequest);
      expect(result.extensions[0]).toEqual({
        field: "code",
        message: "user does not exist",
      });
    });

    it("should return error badRequest, if account already confirmed", async () => {
      const confirmedUser = createUserDB(
        "test_login22",
        "test_email22@gmail.com",
        "12345678",
        true,
      );
      await userCollection.insertOne(confirmedUser);

      const result = await registrationConfirmCase(
        confirmedUser.emailConfirmation.confirmationCode,
      );
      expect(result.status).toBe(ResultStatus.BadRequest);
      expect(result.extensions[0]).toEqual({
        field: "code",
        message: "user is already confirmed",
      });
    });

    it("should return error badRequest, if code is expired", async () => {
      const expiredUser = createUserDB(
        "test_login33",
        "test_email33@gmail.com",
        "12345678",
      );

      /**  устанавливаем для вновь созданного юзера expirationDate кода в прошлом */
      await userCollection.insertOne({
        ...expiredUser,
        emailConfirmation: {
          ...expiredUser.emailConfirmation,
          expirationDate: new Date(new Date().getTime() - 60 * 1000),
        },
      });

      const result = await registrationConfirmCase(
        expiredUser.emailConfirmation.confirmationCode,
      );
      expect(result.status).toBe(ResultStatus.BadRequest);
      expect(result.extensions[0]).toEqual({
        field: "code",
        message: "confirmation code is expired",
      });
    });

    it("success confirm and update user confirmation data", async () => {
      const successConfirmUser = createUserDB(
        "test_login44",
        "test_email44@gmail.com",
        "12345678",
      );
      await userCollection.insertOne(successConfirmUser);

      const result = await registrationConfirmCase(
        successConfirmUser.emailConfirmation.confirmationCode,
      );

      expect(result.status).toBe(ResultStatus.NoContent);

      const createdUsers = await userCollection.findOne({
        login: successConfirmUser.login,
      });
      expect(createdUsers?.email).toBe(successConfirmUser.email);
      expect(createdUsers?.emailConfirmation?.isConfirmed).toBeTruthy();
    });
  });

  describe("resend confirm code", () => {
    const registrationResendCase =
      authService.registrationResendConfirm.bind(authService);
    it("should return error badRequest, if user with email does not exist", async () => {
      const result = await registrationResendCase("some_email@gmail.com");

      expect(mockMailService.sendMail).not.toHaveBeenCalled();

      expect(result.status).toBe(ResultStatus.BadRequest);
      expect(result.extensions[0]).toEqual({
        field: "email",
        message: "user does not exist",
      });
    });

    it("should return error badRequest, if account is confirmed", async () => {
      const confirmedUser = createUserDB(
        "test_login55",
        "test_email55@gmail.com",
        "12345678",
        true,
      );
      await userCollection.insertOne(confirmedUser);

      const result = await registrationResendCase(confirmedUser.email);

      expect(mockMailService.sendMail).not.toHaveBeenCalled();

      expect(result.status).toBe(ResultStatus.BadRequest);
      expect(result.extensions[0]).toEqual({
        field: "email",
        message: "user is already confirmed",
      });
    });

    it("should resend code, if valid data", async () => {
      const newUser = createUserDB(
        "test_login66",
        "test_email66@gmail.com",
        "12345678",
      );
      await userCollection.insertOne(newUser);

      const result = await registrationResendCase(newUser.email);

      expect(result.status).toBe(ResultStatus.NoContent);
      expect(mockMailService.sendMail).toHaveBeenCalled();

      /** проверяем что в БД сохранились новые: confirmationCode, sentDate, expirationDate */
      const updatedUsers = await userCollection.findOne({
        login: newUser.login,
      });

      expect(updatedUsers?.login).toBe(newUser.login);
      expect(updatedUsers?.emailConfirmation?.expirationDate).not.toBe(
        newUser.emailConfirmation.expirationDate,
      );
      expect(updatedUsers?.emailConfirmation?.sentDate).not.toBe(
        newUser.emailConfirmation.sentDate,
      );
      expect(updatedUsers?.emailConfirmation?.confirmationCode).not.toBe(
        newUser.emailConfirmation.confirmationCode,
      );
    });
  });
});
