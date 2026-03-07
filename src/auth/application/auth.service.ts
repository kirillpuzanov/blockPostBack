import { LoginInput } from "../types/auth.types";
import { bcryptService } from "../utils/bcrypt.service";
import { usersQueryRepository } from "../../modules/users/repositories/users.query.repository";

export const authService = {
  async login({ password, loginOrEmail }: LoginInput): Promise<boolean> {
    return this.checkCredentials({ password, loginOrEmail });
  },

  async checkCredentials({
    password,
    loginOrEmail,
  }: LoginInput): Promise<boolean> {
    const user = await usersQueryRepository.getByLoginOrEmail(loginOrEmail);

    if (!user) return false;
    return bcryptService.checkPass(password, user.passwordHash);
  },
};
