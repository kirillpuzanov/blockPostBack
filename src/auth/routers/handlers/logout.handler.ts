import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { ResultStatus } from "../../../core/types/result";

export const logoutHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await authService.logout(refreshToken);

  if (result.status === ResultStatus.NoContent) {
    return res.sendStatus(HTTP_STATUS.noContent);
  }

  res.sendStatus(HTTP_STATUS.unAuthorized);
};
