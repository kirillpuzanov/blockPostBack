import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../core/const/statuses";

import { jwtService } from "../../composition-root";

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      return res.sendStatus(HTTP_STATUS.unAuthorized);
    }

    const token = req.headers.authorization.split(" ")[1];
    const { userId } = await jwtService.verifyToken(token);

    if (userId) {
      req.userMetaData = { id: userId };
      return next();
    }
    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch {
    res.sendStatus(HTTP_STATUS.unAuthorized);
  }
};
