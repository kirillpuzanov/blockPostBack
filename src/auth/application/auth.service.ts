import { LoginInput } from "../types/auth.types";
import { bcryptService } from "../utils/bcrypt.service";
import { usersQueryRepository } from "../../modules/users/repositories/users.query.repository";
import { Result, ResultStatus } from "../../core/types/result";
import { WithId } from "mongodb";
import { UserDb } from "../../modules/users/types/user.types";
import { createResultObject } from "../../core/utils/create-result-object";
import { jwtService } from "../utils/jwt.service";

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
};
