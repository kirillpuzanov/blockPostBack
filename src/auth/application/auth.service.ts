import { LoginInput } from "../types/auth.types";
import { bcryptService } from "../utils/bcrypt.service";
import { usersQueryRepository } from "../../modules/users/repositories/users.query.repository";
import { Result, ResultStatus } from "../../core/types/result";
import { WithId } from "mongodb";
import { UserDb } from "../../modules/users/types/user.types";
import { createResultObject } from "../../core/utils/create-result-object";
import { jwtService } from "../utils/jwt.service";

import { usersRepository } from "../../modules/users/repositories/users.repository";
import { mailService } from "../utils/mail.service";
import { mailTemplates } from "../utils/mail-templates";
import { createUserDB } from "../../modules/users/application/utils";

export const authService = {
  async login({
    password,
    loginOrEmail,
  }: LoginInput): Promise<Result<{ accessToken: string }>> {
    /** находим пользователя по логину или емаил, проверяем валидность пароля */
    const res = await this.checkCredentials({ password, loginOrEmail });

    if (res.status !== ResultStatus.Success) {
      return createResultObject({ status: res.status });
    }

    /** если пользователь есть в системе и пароль верный, генерим токен и отдаем его */
    const accessToken = await jwtService.createToken(res.data!._id.toString());

    return createResultObject({
      status: ResultStatus.Success,
      data: { accessToken },
    });
  },

  async checkCredentials({
    password,
    loginOrEmail,
  }: LoginInput): Promise<Result<WithId<UserDb>>> {
    const user = await usersQueryRepository.getByLoginOrEmail(loginOrEmail);

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

  async registration(
    password: string,
    email: string,
    login: string,
  ): Promise<Result<null>> {
    const userAlreadyExist = await usersRepository.checkUserIsAlreadyExist(
      login,
      email,
    );
    /** проверяем, что это новый пользователь */
    if (userAlreadyExist) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "loginOrEmail", message: "Already Registered" }],
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

    return createResultObject({ status: ResultStatus.Created });
  },

  async registrationConfirm(code: string): Promise<Result<null>> {
    const user = await usersQueryRepository.getByConfirmCode(code);

    if (!user) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "user", message: "user does not exist" }],
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "user", message: "user is already confirmed" }],
      });
    }

    if (user.emailConfirmation.expirationDate > new Date()) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [
          { field: "code", message: "confirmation code is expired." },
        ],
      });
    }

    const updatedCount = await usersRepository.updateToConfirmRegistration(
      user._id,
    );

    if (updatedCount < 1) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "user", message: "user does not exist" }],
      });
    }
    return createResultObject({ status: ResultStatus.NoContent });
  },
};
