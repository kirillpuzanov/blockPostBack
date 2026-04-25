import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { errorHandler } from "../../../core/errors/error.handler";
import { authService } from "../../application/auth.service";
import { ResultStatus } from "../../../core/types/result";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";

export const recoveryPassHandler = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
) => {
  try {
    const { email } = req.body;

    const result = await authService.recoveryPassword(email);

    if (result.status === ResultStatus.NoContent) {
      return res.sendStatus(HTTP_STATUS.noContent);
    }

    return res.sendStatus(mapResultToHttpStatus(result.status));
  } catch (e) {
    errorHandler(e, res);
  }
};
