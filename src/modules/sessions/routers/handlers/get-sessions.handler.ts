import { Request, Response } from "express";
import { ResultStatus } from "../../../../core/types/result";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/error.handler";
import { sessionsService } from "../../application/sessions.service";

export const getSessionsHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.userMetaData!.id;

    const result = await sessionsService.getAllSessions(userId);

    if (result.status === ResultStatus.Success) {
      return res.status(HTTP_STATUS.ok).send(result.data);
    }

    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch (e) {
    errorHandler(e, res);
  }
};
