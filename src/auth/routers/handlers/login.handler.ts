import { Request, Response } from "express";
import { LoginInput } from "../../types/auth.types";
import { authService } from "../../application/auth.service";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { ResultStatus } from "../../../core/types/result";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";
import { errorHandler } from "../../../core/errors/error.handler";

export const loginHandler = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
) => {
  try {
    const { password, loginOrEmail } = req.body;

    const ip = req.ip ?? "";
    const ua = req.useragent;
    const deviceName = `${ua?.browser ?? "unknown"} ${ua?.version ?? "unknown"}`;

    const result = await authService.login({
      password,
      loginOrEmail,
      deviceName,
      ip,
    });

    if (result.status === ResultStatus.Success) {
      return res
        .cookie("refreshToken", result.data!.refreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(mapResultToHttpStatus(result.status))
        .send({ accessToken: result.data!.accessToken });
    }

    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch (e) {
    errorHandler(e, res);
  }
};
