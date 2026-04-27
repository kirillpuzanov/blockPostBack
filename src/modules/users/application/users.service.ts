import { CreateUserInput } from "../types/user.types";
import { DomainError, NotFoundError } from "../../../core/errors/error.handler";
import { createUserDB } from "./utils";
import { UsersRepository } from "../repositories/users.repository";
import { SessionsRepository } from "../../sessions/repositories/sessions.repository";
import { BcryptService } from "../../../auth/utils/bcrypt.service";

export class UsersService {
  constructor(
    public usersRepository: UsersRepository,
    public sessionsRepository: SessionsRepository,
    public bcryptService: BcryptService,
  ) {}

  async createUser(input: CreateUserInput): Promise<string> {
    const { login, email, password } = input;

    const emailAlreadyExist =
      await this.usersRepository.checkUniqueEmailOrLogin(email);
    if (emailAlreadyExist) {
      throw new DomainError("user with this email already exists", "email");
    }

    const loginAlreadyExist =
      await this.usersRepository.checkUniqueEmailOrLogin(login);
    if (loginAlreadyExist) {
      throw new DomainError("user with this login already exists", "login");
    }

    const passwordHash = await this.bcryptService.generateHash(password);

    /** при создании админом подтверждение не требуется */
    const user = createUserDB(login, email, passwordHash, true);

    return this.usersRepository.create(user);
  }

  async deleteOne(id: string): Promise<void> {
    const deletedCount = await this.usersRepository.deleteOne(id);

    if (deletedCount < 1) {
      throw new NotFoundError("user is not exists", "user");
    }
    await this.sessionsRepository.deleteAllUserSessions(id);

    return;
  }
}
