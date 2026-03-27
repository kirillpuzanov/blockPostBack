import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { ResultStatus } from "../../../core/types/result";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { errorHandler } from "../../../core/errors/error.handler";

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    const userId = req.userMetaData?.id;

    const result = await authService.refreshTokens(refreshToken, userId!);

    if (result.status === ResultStatus.Success) {
      return res
        .cookie("refreshToken", result.data!.refreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(HTTP_STATUS.ok)
        .send({ accessToken: result.data!.accessToken });
    }
    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch (e) {
    errorHandler(e, res);
  }
};
