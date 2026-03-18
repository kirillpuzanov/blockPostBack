import { Request, Response } from "express";
import { RegistrationInput } from "../../types/auth.types";
import { HTTP_STATUS } from "../../../core/const/statuses";
import {
  createErrorMessages,
  errorHandler,
} from "../../../core/errors/error.handler";
import { authService } from "../../application/auth.service";
import { ResultStatus } from "../../../core/types/result";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";

export const registrationHandler = async (
  req: Request<{}, {}, RegistrationInput>,
  res: Response,
) => {
  try {
    const { password, email, login } = req.body;

    const result = await authService.registration(password, email, login);

    if (result.status === ResultStatus.Created) {
      return res.sendStatus(HTTP_STATUS.created);
    }

    return res
      .status(mapResultToHttpStatus(result.status))
      .send(createErrorMessages(result.extensions));
  } catch (e) {
    errorHandler(e, res);
  }
};
