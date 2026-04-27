import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../core/const/statuses";
import { jwtService } from "../utils/jwt.service";

import { sessionsRepository } from "../../composition-root";

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

    const { userId, deviceId, iat } =
      await jwtService.verifyToken(refreshToken);

    if (!userId || !deviceId) {
      return res.sendStatus(HTTP_STATUS.unAuthorized);
    }

    const currentSession = await sessionsRepository.getSession(deviceId);

    /** проверяем валидность полученного refreshToken по метке exp в BD в активной сесии девайса */
    if (currentSession) {
      /** если переданный токен еще не протух, пренадлежит текущему пользователю, с той же дадой выпуска -> пропускаем дальше */
      if (
        currentSession.exp > Date.now() &&
        currentSession.iat === iat &&
        userId === currentSession.userId
      ) {
        req.userMetaData = { id: userId };
        return next();
      } else {
        /** Просто не пускаем, нельзя удалять сессию, не знаем какое из условий не прошло.
         * можно удалить чужую сессию, если как то получили чужой userId */
        return res.sendStatus(HTTP_STATUS.unAuthorized);
      }
    }
    return res.sendStatus(HTTP_STATUS.unAuthorized);
  } catch {
    res.sendStatus(HTTP_STATUS.unAuthorized);
  }
};
