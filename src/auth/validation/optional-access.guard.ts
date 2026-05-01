import { NextFunction, Request, Response } from "express";
import { JwtService } from "../utils/jwt.service";
import { container } from "../../composition-root";

const jwtService = container.get(JwtService);

export const optionalAccessGuard = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return next();
  }

  const token = req.headers.authorization.split(" ")[1];
  const { userId } = jwtService.decodeToken(token);

  if (userId) {
    req.userMetaData = { id: userId };
  }
  return next();
};
