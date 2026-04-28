import { Request, Response } from "express";
import { ResultStatus } from "../../../core/types/result";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { errorHandler } from "../../../core/errors/error.handler";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";
import { SessionsService } from "../application/sessions.service";
import { inject, injectable } from "inversify";

@injectable()
export class SessionsController {
  constructor(
    @inject(SessionsService) public sessionsService: SessionsService,
  ) {}

  async getSessions(req: Request, res: Response) {
    try {
      const userId = req.userMetaData!.id;

      const result = await this.sessionsService.getAllSessions(userId);

      if (result.status === ResultStatus.Success) {
        return res.status(HTTP_STATUS.ok).send(result.data);
      }

      return res.sendStatus(HTTP_STATUS.unAuthorized);
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async deleteAllMySessions(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;

      const result =
        await this.sessionsService.deleteAllMySessions(refreshToken);

      if (result.status === ResultStatus.NoContent) {
        return res.sendStatus(HTTP_STATUS.noContent);
      }

      return res.sendStatus(HTTP_STATUS.unAuthorized);
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async deleteMySession(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = req.userMetaData!.id;
      const deletedDeviceId = req.params.id;

      const result = await this.sessionsService.deleteMySession(
        userId,
        deletedDeviceId,
      );

      if (result.status === ResultStatus.NoContent) {
        return res.sendStatus(HTTP_STATUS.noContent);
      }

      return res.sendStatus(mapResultToHttpStatus(result.status));
    } catch (e) {
      errorHandler(e, res);
    }
  }
}
