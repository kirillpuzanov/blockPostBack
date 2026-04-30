import { Response, Router } from "express";
import { clearDB } from "../../db/database";
import { HTTP_STATUS } from "../../core/const/statuses";
import { errorHandler } from "../../core/errors/error.handler";

export const clearDbRouter = Router({});

clearDbRouter.delete("", async (_, res: Response) => {
  try {
    await clearDB();
    res.sendStatus(HTTP_STATUS.noContent);
  } catch (error) {
    errorHandler(error, res);
  }
});
