import { LoginInput } from "../types/auth.types";
import { bcryptService } from "../utils/bcrypt.service";

export const authService = {
  async login({ password, loginOrEmail }: LoginInput): Promise<boolean> {
    return this.checkCredentials({ password, loginOrEmail });
  },

  async checkCredentials({
    password,
    loginOrEmail,
  }: LoginInput): Promise<boolean> {
    // const user = userRepository.findByLoginOrEmail({ password, loginOrEmail });
    // todo - userRepository
    const user = { passwordHash: "123" };

    if (!user) return false;
    return bcryptService.checkPass(password, user.passwordHash);
  },
};
