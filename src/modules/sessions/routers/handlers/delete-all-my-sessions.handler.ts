import { Request, Response } from "express";
import { ResultStatus } from "../../../../core/types/result";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/error.handler";
import { sessionsService } from "../../application/sessions.service";

export const deleteAllMySessionsHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { refreshToken } = req.cookies;

    const result = await sessionsService.deleteAllMySessions(refreshToken);

    if (result.status === ResultStatus.NoContent) {
      return res.sendStatus(HTTP_STATUS.noContent);
    }

    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch (e) {
    errorHandler(e, res);
  }
};
