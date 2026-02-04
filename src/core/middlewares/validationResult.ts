import { NextFunction, Request, Response } from "express";
import {
  FieldValidationError,
  ValidationError,
  validationResult as validationExpressResult,
} from "express-validator";
import { BaseError } from "../types/baseError";
import { HTTP_STATUS } from "../const/statuses";
import { createBaseError } from "../utils/baseError";

const errorFormat = (error: ValidationError): BaseError => {
  const e = error as unknown as FieldValidationError;
  return {
    field: e.path,
    message: e.msg,
  };
};

export const validationResult = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationExpressResult(req)
    .formatWith(errorFormat)
    .array({ onlyFirstError: true });

  if (!!errors?.length) {
    res.status(HTTP_STATUS.badRequest).send(createBaseError(errors));
  }
  next();
};
