import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../core/const/statuses";
import { jwtService } from "../utils/jwt.service";

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      return res.sendStatus(HTTP_STATUS.unAuthorized);
    }

    const userId = await jwtService.verifyToken(refreshToken);

    if (userId) {
      req.userMetaData = { id: userId };
      return next();
    }

    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch {
    res.sendStatus(HTTP_STATUS.unAuthorized);
  }
};
