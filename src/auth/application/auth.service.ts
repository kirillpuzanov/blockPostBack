import { LoginInput } from "../types/auth.types";
import { bcryptService } from "../utils/bcrypt.service";
import { usersQueryRepository } from "../../modules/users/repositories/users.query.repository";
import { Result, ResultStatus } from "../../core/types/result";
import { WithId } from "mongodb";
import { UserDb } from "../../modules/users/types/user.types";
import { createResultObject } from "../../core/utils/create-result-object";
import { jwtService } from "../utils/jwt.service";
import { v4 as idv4 } from "uuid";

import { usersRepository } from "../../modules/users/repositories/users.repository";
import { mailService } from "../utils/mail.service";
import { mailTemplates } from "../utils/mail-templates";

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

    if (userAlreadyExist) {
      return createResultObject({
        status: ResultStatus.BadRequest,
        extensions: [{ field: "loginOrEmail", message: "Already Registered" }],
      });
    }

    const passwordHash = await bcryptService.generateHash(password);

    const user: UserDb = {
      login,
      email,
      createdAt: new Date().toISOString(),
      passwordHash,
      emailConfirmation: {
        confirmationCode: idv4(),
        expirationDate: new Date(new Date().getTime() + 10 * 60 * 1000),
        isConfirmed: false,
      },
    };

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
};
