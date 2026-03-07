import { Request, Response } from "express";
import { getMatchedQuery } from "../../../../core/utils/get-matched-query";
import { UsersQueryInput } from "../../types/user.types";
import { errorHandler } from "../../../../core/errors/error.handler";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { usersQueryRepository } from "../../repositories/users.query.repository";

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const matchedQuery = getMatchedQuery<UsersQueryInput>(req);

    const usersView = await usersQueryRepository.getAll(matchedQuery);

    res.status(HTTP_STATUS.ok).send(usersView);
  } catch (error) {
    errorHandler(error, res);
  }
};
