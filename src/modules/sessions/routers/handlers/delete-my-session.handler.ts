import { Request, Response } from "express";
import { ResultStatus } from "../../../../core/types/result";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/error.handler";
import { sessionsService } from "../../application/sessions.service";
import { mapResultToHttpStatus } from "../../../../core/utils/map-result-to-http-status";

export const deleteMySessionHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const userId = req.userMetaData!.id;
    const deletedDeviceId = req.params.id;

    const result = await sessionsService.deleteMySession(
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
};
