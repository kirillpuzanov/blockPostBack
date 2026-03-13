import { Request, Response } from "express";
import { LoginInput } from "../../types/auth.types";
import { HTTP_STATUS } from "../../../core/const/statuses";

export const getMeHandler = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
) => {
  const user = req.userMetaData;

  if (!user) {
    res.sendStatus(HTTP_STATUS.unAuthorized);
    return;
  }

  const { id, login, email } = user;

  res.status(HTTP_STATUS.ok).send({ id, login, email });
};
