import { Request, Response } from "express";
import { LoginInput, MeViewModel } from "../../types/auth.types";
import { HTTP_STATUS } from "../../../core/const/statuses";

export const getMeHandler = async (
  req: Request<{}, MeViewModel, LoginInput>,
  res: Response,
) => {
  const user = req.userMetaData;

  if (!user) {
    res.sendStatus(HTTP_STATUS.unAuthorized);
    return;
  }

  const { id, login, email } = user;
  const meView: MeViewModel = { userId: id, login, email };

  res.status(HTTP_STATUS.ok).send(meView);
};
