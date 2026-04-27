import { LoginInputWithMeta } from "../types/auth.types";
import { Result, ResultStatus } from "../../core/types/result";
import { WithId } from "mongodb";
import { UserDb } from "../../modules/users/types/user.types";
import { createResultObject } from "../../core/utils/create-result-object";
import { jwtService } from "../utils/jwt.service";
import { randomUUID } from "crypto";

import { mailService } from "../utils/mail.service";
import { mailTemplates } from "../utils/mail-templates";
import {
  createUserDB,
  getNewConfirmationData,
} from "../../modules/users/application/utils";
import { AuthSessionDb } from "../../modules/sessions/types/session.types";
import {
  bcryptService,
  sessionsRepository,
  usersRepository,
} from "../../composition-root";

export const authService = {
  async login({
    password,
    loginOrEmail,
    ip,
    deviceName,
  }: LoginInputWithMeta): Promise<
    Result<{ accessToken: string; refreshToken: string }>
  > {
    /** находим пользователя по логину или емаил, проверяем валидность пароля */
    const res = await this.checkCredentials({ password, loginOrEmail });

    if (res.status !== ResultStatus.Success) {
      return createResultObject({ status: res.status });
    }

    const deviceId = randomUUID();
    const userId = res.data!._id.toString();

    /** если пользователь есть в системе и пароль верный, генерим токены и отдаем их, в refresh добавляем deviceId */
    const { accessToken, refreshToken } = jwtService.createTokens(
      userId,
      deviceId,
    );

    /** создаем сессию для этого утстройства */
    const { exp, iat } = jwtService.decodeRefreshToken(refreshToken);
    const session: AuthSessionDb = {
      ip,
      exp,
      iat,
      userId,
      deviceId,
      deviceName,
    };

    await sessionsRepository.createSession(session);

    return createResultObject({
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
    });
  },

  async registration(
    password: string,
    email: string,
    login: string,
  ): Promise<Result<null>> {
    /** проверяем, что это новый пользователь (логин пароль на уникальность) */
    const emailAlreadyExist =
      await usersRepository.checkUniqueEmailOrLogin(email);

    if (emailAlreadyExist) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [
          { field: "email", message: "this email already registered" },
        ],
      });
    }

    const loginAlreadyExist =
      await usersRepository.checkUniqueEmailOrLogin(login);

    if (loginAlreadyExist) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [
          { field: "login", message: "this login already registered" },
        ],
      });
    }

    const passwordHash = await bcryptService.generateHash(password);

    /** сохраняем пользователя в БД, с флагом неподтвержденной регистрации
     * и мета инф. для последующего подтверждения регистрации */
    const user: UserDb = createUserDB(login, email, passwordHash);

    await usersRepository.create(user);

    mailService
      .sendMail(
        user.email,
        user.emailConfirmation.confirmationCode,
        mailTemplates.registration,
      )
      .catch((error) => console.error("error send email", error));

    return createResultObject({ status: ResultStatus.NoContent });
  },

  async registrationConfirm(code: string): Promise<Result<null>> {
    const user = await usersRepository.getByConfirmCode(code);

    if (!user) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "code", message: "user does not exist" }],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "code", message: "user is already confirmed" }],
      });
    }

    if (new Date() > user.emailConfirmation.expirationDate) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [
          { field: "code", message: "confirmation code is expired" },
        ],
      });
    }

    const updatedCount = await usersRepository.update(user._id, {
      "emailConfirmation.isConfirmed": true,
    });

    if (updatedCount < 1) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "user", message: "user does not exist" }],
      });
    }
    return createResultObject({ status: ResultStatus.NoContent });
  },

  async registrationResendConfirm(email: string): Promise<Result<null>> {
    const user = await usersRepository.getByLoginOrEmail(email);

    if (!user) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "email", message: "user does not exist" }],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "email", message: "user is already confirmed" }],
      });
    }

    const { confirmationCode, expirationDate, sentDate } =
      getNewConfirmationData();

    const updatedCount = await usersRepository.update(user._id, {
      "emailConfirmation.confirmationCode": confirmationCode,
      "emailConfirmation.sentDate": sentDate,
      "emailConfirmation.expirationDate": expirationDate,
    });

    if (updatedCount < 1) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "user", message: "user does not exist" }],
      });
    }

    mailService
      .sendMail(user.email, confirmationCode, mailTemplates.registration)
      .catch((error) => console.error("error send email", error));

    return createResultObject({ status: ResultStatus.NoContent });
  },

  async refreshTokens(
    oldRefreshToken: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    /** проверка валидности текущего токена уже сделана в refreshTokenGuard */

    const { userId, deviceId } = jwtService.decodeRefreshToken(oldRefreshToken);
    /** создаем новую пару токенов */
    const { accessToken, refreshToken } = jwtService.createTokens(
      userId,
      deviceId,
    );

    /** берем новые данные жизни токена */
    const { iat, exp } = jwtService.decodeRefreshToken(refreshToken);

    /** обновляем данные жизни текущей сессии */
    const updatedCount = await sessionsRepository.updateSession(
      userId,
      deviceId,
      iat,
      exp,
    );
    if (updatedCount > 0) {
      return createResultObject({
        status: ResultStatus.Success,
        data: { accessToken, refreshToken },
      });
    } else {
      return createResultObject({
        status: ResultStatus.Unauthorized,
      });
    }
  },

  async logout(refreshToken: string): Promise<Result<null>> {
    /** проверка валидности текущего токена уже сделана в refreshTokenGuard */
    const { userId, deviceId } = jwtService.decodeRefreshToken(refreshToken);

    /** удаляем текущую сессию */
    await sessionsRepository.deleteSession(userId, deviceId);

    return createResultObject({
      status: ResultStatus.NoContent,
    });
  },

  async checkCredentials({
    password,
    loginOrEmail,
  }: {
    password: string;
    loginOrEmail: string;
  }): Promise<Result<WithId<UserDb>>> {
    const user = await usersRepository.getByLoginOrEmail(loginOrEmail);

    if (!user) {
      return createResultObject({ status: ResultStatus.Unauthorized });
    }

    /** сравнение хэша из БД, с хешом логина переданным при аутентификации */
    const isCorrectPass = await bcryptService.checkPass(
      password,
      user.passwordHash,
    );

    if (!isCorrectPass) {
      return createResultObject({ status: ResultStatus.Unauthorized });
    }

    return createResultObject({
      status: ResultStatus.Success,
      data: user,
    });
  },

  async recoveryPassword(email: string): Promise<Result<null>> {
    const user = await usersRepository.getByLoginOrEmail(email);

    /** если такого пользователя нет все-равно вернем 204, чтобы не раскрывать существование email */
    if (!user) {
      return createResultObject({ status: ResultStatus.NoContent });
    }

    const { confirmationCode, expirationDate, sentDate } =
      getNewConfirmationData();

    const recoveryPassData = {
      recoveryPassCode: confirmationCode,
      expirationCodeDate: expirationDate,
      sentCodeDate: sentDate,
    };

    await usersRepository.update(user._id, {
      recoveryPassData,
    });

    mailService
      .sendRecoveryPassMail(email, confirmationCode, mailTemplates.recoveryPass)
      .catch((error) => console.error("error recovery pass email", error));

    return createResultObject({ status: ResultStatus.NoContent });
  },

  async setNewPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<Result<null>> {
    const user = await usersRepository.getByRecoveryPassCode(recoveryCode);

    if (!user) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "recoveryCode", message: "user does not exist" }],
      });
    }

    const expirationCodeDate = user.recoveryPassData?.expirationCodeDate;

    if (!expirationCodeDate || new Date() > expirationCodeDate) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [
          {
            field: "recoveryCode",
            message: "recovery password code does not exist or is expired",
          },
        ],
      });
    }

    const newPasswordHash = await bcryptService.generateHash(newPassword);

    const updatedCount = await usersRepository.update(user._id, {
      passwordHash: newPasswordHash,
    });

    if (updatedCount > 0) {
      return createResultObject({ status: ResultStatus.NoContent });
    } else {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "user", message: "user does not exist" }],
      });
    }
  },
};
