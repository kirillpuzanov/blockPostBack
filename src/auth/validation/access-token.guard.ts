import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../core/const/statuses";
import { jwtService } from "../utils/jwt.service";

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    res.sendStatus(HTTP_STATUS.unAuthorized);
    return;
  }

  const token = req.headers.authorization.split(" ")[1];
  const userId = await jwtService.verifyToken(token);

  if (userId) {
    req.userMetaData = { userId };
    next();
  }
  res.sendStatus(HTTP_STATUS.unAuthorized);
  return;
};
