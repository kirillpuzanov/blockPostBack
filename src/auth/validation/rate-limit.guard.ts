import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../core/const/statuses";
import { RateLimitItem } from "../types/auth.types";
import { rateLimitCollection } from "../../db/database";

export const rateLimitGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip = req.ip!;
    const url = req.originalUrl;

    /** проверяем количество за последние 10 сек */
    const tenSecondsAgo = Date.now() - 10 * 1000;

    const requestsCount = await rateLimitCollection.countDocuments({
      ip,
      url,
      lastRequestDate: { $gte: tenSecondsAgo },
    });

    if (requestsCount >= 5) {
      return res.sendStatus(HTTP_STATUS.rateLimit);
    }

    const requestMeta: RateLimitItem = {
      ip,
      url,
      lastRequestDate: Date.now(),
    };
    /** добавили очередное обращение */
    await rateLimitCollection.insertOne(requestMeta);

    return next();
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
