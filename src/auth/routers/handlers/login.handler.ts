import { Request, Response } from "express";
import { LoginInput } from "../../types/auth.types";
import { authService } from "../../application/auth.service";
import { HTTP_STATUS } from "../../../core/const/statuses";

export const loginHandler = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
) => {
  const { password, loginOrEmail } = req.body;

  const isSuccess = await authService.login({ password, loginOrEmail });
  if (isSuccess) {
    return res.sendStatus(HTTP_STATUS.noContent);
  }
  return res.sendStatus(HTTP_STATUS.unAuthorized);
};
