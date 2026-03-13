import { Request, Response } from "express";
import { LoginInput } from "../../types/auth.types";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { usersQueryRepository } from "../../../modules/users/repositories/users.query.repository";

export const getMeHandler = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
) => {
  const userId = req.userMetaData?.userId;

  if (!userId) {
    res.sendStatus(HTTP_STATUS.unAuthorized);
    return;
  }

  const user = await usersQueryRepository.getById(userId);
  const { id, login, email } = user;

  res.status(HTTP_STATUS.ok).send({ id, login, email });
};
