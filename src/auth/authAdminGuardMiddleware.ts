import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../core/const/statuses";

const AUTH_TYPE = "Basic";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "qwerty";

export const authAdminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeaderString = req.headers["authorization"];

  if (!authHeaderString) {
    res.sendStatus(HTTP_STATUS.unAuthorized);
    return;
  }

  const [authType, token] = authHeaderString.split(" ");

  if (authType !== AUTH_TYPE) {
    res.sendStatus(HTTP_STATUS.unAuthorized);
    return;
  }

  const credentials = Buffer.from(token, "base64").toString("utf-8");

  const [userName, pass] = credentials.split(":");

  if (userName !== ADMIN_USERNAME || pass !== ADMIN_PASSWORD) {
    res.sendStatus(HTTP_STATUS.unAuthorized);
    return;
  }

  next();
};
