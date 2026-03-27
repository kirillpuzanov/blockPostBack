import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { ResultStatus } from "../../../core/types/result";
import { errorHandler } from "../../../core/errors/error.handler";

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    const result = await authService.logout(refreshToken);

    if (result.status === ResultStatus.NoContent) {
      return res.sendStatus(HTTP_STATUS.noContent);
    }

    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch (e) {
    errorHandler(e, res);
  }
};
