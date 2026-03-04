import { BaseError } from "../types/base-error";
import { Response } from "express";
import { HTTP_STATUS } from "../const/statuses";

export const createErrorMessages = (errors: BaseError[]) => {
  return { errorsMessages: errors };
};

export class NotFoundError extends Error {
  public field: string;

  constructor(message: string, field = "") {
    super(message);
    this.field = field;
  }
}

export const errorHandler = (error: unknown, res: Response) => {
  if (error instanceof NotFoundError) {
    res.status(HTTP_STATUS.notFound).send(
      createErrorMessages([
        {
          field: error.field,
          message: error.message,
        },
      ]),
    );
  }

  res.status(HTTP_STATUS.serverError);
  return;
};
