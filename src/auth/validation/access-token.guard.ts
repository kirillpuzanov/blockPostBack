import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../core/const/statuses";
import { jwtService } from "../utils/jwt.service";
import { usersQueryRepository } from "../../modules/users/repositories/users.query.repository";

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
    const userId = await jwtService.verifyToken(token);

    if (userId) {
      const user = await usersQueryRepository.getById(userId);

      if (user) {
        req.userMetaData = user;
        return next();
      }
    }
    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch {
    res.sendStatus(HTTP_STATUS.unAuthorized);
  }
};
