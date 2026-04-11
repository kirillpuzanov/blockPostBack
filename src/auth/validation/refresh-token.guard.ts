import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../core/const/statuses";
import { jwtService } from "../utils/jwt.service";

import { sessionsRepository } from "../../modules/sessions/repositories/sessions.repository";

export const refreshTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(HTTP_STATUS.unAuthorized);
    }

    const { userId, deviceId } = await jwtService.verifyToken(refreshToken);

    if (!userId || !deviceId) {
      return res.sendStatus(HTTP_STATUS.unAuthorized);
    }

    const currentSession = await sessionsRepository.getSession(
      userId,
      deviceId,
    );

    /** проверяем валидность полученного refreshToken по метке exp в BD в активной сесии девайса */
    if (currentSession) {
      /** если переданный токен еще не протух, пропускаем дальше */
      if (new Date(currentSession.exp) > new Date()) {
        req.userMetaData = { id: userId };
        return next();
      } else {
        /** если сессия есть, но токен протух --> удаляем сессию, кидаем 401 */
        await sessionsRepository.deleteSession(userId, deviceId);
        return res.sendStatus(HTTP_STATUS.unAuthorized);
      }
    }

    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch {
    res.sendStatus(HTTP_STATUS.unAuthorized);
  }
};
