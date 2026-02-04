import { Response, Router } from "express";
import { database } from "../../db/database";
import { HTTP_STATUS } from "../../core/const/statuses";

export const clearDbRouter = Router({});

clearDbRouter.delete("", (_, res: Response) => {
  database.blogs = [];
  database.posts = [];

  res.sendStatus(HTTP_STATUS.noContent);
});
