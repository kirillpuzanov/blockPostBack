import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../core/const/statuses";
import {
  createErrorMessages,
  errorHandler,
} from "../../../core/errors/error.handler";
import { authService } from "../../application/auth.service";
import { ResultStatus } from "../../../core/types/result";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";

export const setNewPasswordHandler = async (
  req: Request<{}, {}, { newPassword: string; recoveryCode: string }>,
  res: Response,
) => {
  try {
    const { newPassword, recoveryCode } = req.body;

    const result = await authService.setNewPassword(newPassword, recoveryCode);

    if (result.status === ResultStatus.NoContent) {
      return res.sendStatus(HTTP_STATUS.noContent);
    }

    return res
      .status(mapResultToHttpStatus(result.status))
      .send(createErrorMessages(result.extensions));
  } catch (e) {
    errorHandler(e, res);
  }
};
