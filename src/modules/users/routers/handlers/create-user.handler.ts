import { Request, Response } from "express";
import { errorHandler } from "../../../../core/errors/error.handler";
import { CreateUserInput, UserViewModel } from "../../types/user.types";
import { usersService } from "../../application/users.service";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { usersQueryRepository } from "../../repositories/users.query.repository";

export const createUserHandler = async (
  req: Request<{}, UserViewModel, CreateUserInput>,
  res: Response,
) => {
  try {
    const createdUserId = await usersService.createUser(req.body);
    const userView = await usersQueryRepository.getById(createdUserId);

    res.status(HTTP_STATUS.created).send(userView);
  } catch (error) {
    errorHandler(error, res);
  }
};
