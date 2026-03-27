import { Request, Response } from "express";
import { LoginInput, MeViewModel } from "../../types/auth.types";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { usersQueryRepository } from "../../../modules/users/repositories/users.query.repository";

export const getMeHandler = async (
  req: Request<{}, MeViewModel, LoginInput>,
  res: Response,
) => {
  const userId = req.userMetaData?.id;

  const user = await usersQueryRepository.getById(userId!);

  if (!user) {
    res.sendStatus(HTTP_STATUS.unAuthorized);
    return;
  }
  const { id, login, email } = user;
  const meView: MeViewModel = { userId: id, login, email };

  res.status(HTTP_STATUS.ok).send(meView);
};
