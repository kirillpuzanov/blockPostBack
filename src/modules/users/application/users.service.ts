import { CreateUserInput } from "../types/user.types";
import { DomainError, NotFoundError } from "../../../core/errors/error.handler";
import { bcryptService } from "../../../auth/utils/bcrypt.service";
import { usersRepository } from "../repositories/users.repository";
import { createUserDB } from "./utils";
import { sessionsRepository } from "../../sessions/repositories/sessions.repository";

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

    /** при создании админом подтверждение не требуется */
    const user = createUserDB(login, email, passwordHash, true);

    return usersRepository.create(user);
  },

  async deleteOne(id: string): Promise<void> {
    const deletedCount = await usersRepository.deleteOne(id);

    if (deletedCount < 1) {
      throw new NotFoundError("user is not exists", "user");
    }
    await sessionsRepository.deleteAllUserSessions(id);

    return;
  },
};
