import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { ResultStatus } from "../../../core/types/result";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";
import { HTTP_STATUS } from "../../../core/const/statuses";

export const refreshTokenHandler = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const userId = req.userMetaData?.id;

  const result = await authService.refreshTokens(refreshToken, userId!);

  if (result.status === ResultStatus.Success) {
    return res
      .cookie("refreshToken", result.data!.refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(mapResultToHttpStatus(result.status))
      .send({ accessToken: result.data!.accessToken });
  }

  res.sendStatus(HTTP_STATUS.unAuthorized);
};
