import { Request, Response } from "express";
import { getMatchedQuery } from "../../../core/utils/get-matched-query";
import {
  CreateUserInput,
  UsersQueryInput,
  UserViewModel,
} from "../domain/user.types";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { errorHandler } from "../../../core/errors/error.handler";
import { UsersQueryRepository } from "../repositories/users.query.repository";
import { UsersService } from "../application/users.service";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersQueryRepository)
    public usersQueryRepository: UsersQueryRepository,
    @inject(UsersService) public usersService: UsersService,
  ) {}

  async getUsers(req: Request, res: Response) {
    try {
      const matchedQuery = getMatchedQuery<UsersQueryInput>(req);

      const usersView = await this.usersQueryRepository.getAll(matchedQuery);

      res.status(HTTP_STATUS.ok).send(usersView);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async createUser(
    req: Request<{}, UserViewModel, CreateUserInput>,
    res: Response,
  ) {
    try {
      const createdUserId = await this.usersService.createUser(req.body);
      const userView = await this.usersQueryRepository.getById(createdUserId);

      res.status(HTTP_STATUS.created).send(userView);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async deleteUser(req: Request<{ id: string }>, res: Response) {
    try {
      await this.usersService.deleteOne(req.params.id);
      res.sendStatus(HTTP_STATUS.noContent);
      return;
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
