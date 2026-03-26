import { Request, Response } from "express";
import { LoginInput } from "../../types/auth.types";
import { authService } from "../../application/auth.service";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { ResultStatus } from "../../../core/types/result";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";

export const loginHandler = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
) => {
  const { password, loginOrEmail } = req.body;

  const result = await authService.login({ password, loginOrEmail });

  if (result.status === ResultStatus.Success) {
    res
      .cookie("refreshToken", result.data!.accessToken, {
        httpOnly: true,
        secure: true,
      })
      .status(mapResultToHttpStatus(result.status))
      .send({ accessToken: result.data!.accessToken });
    return;
  }

  res.sendStatus(HTTP_STATUS.unAuthorized);
};
