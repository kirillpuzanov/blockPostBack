import { CreateUserInput, UserDb } from "../types/user.types";
import { DomainError } from "../../../core/errors/error.handler";
import { bcryptService } from "../../../auth/utils/bcrypt.service";
import { usersRepository } from "../repositories/users.repository";

export const usersService = {
  async createUser(input: CreateUserInput): Promise<string> {
    const { login, email, password } = input;

    const emailAlreadyExist =
      await usersRepository.checkUniqueEmailOrLogin(email);
    if (emailAlreadyExist) {
      throw new DomainError("user with this email already exists", "email");
    }

    const loginAlreadyExist =
      await usersRepository.checkUniqueEmailOrLogin(login);
    if (loginAlreadyExist) {
      throw new DomainError("user with this login already exists", "login");
    }

    const passwordHash = await bcryptService.generateHash(password);

    const user: UserDb = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    return usersRepository.create(user);
  },
};
