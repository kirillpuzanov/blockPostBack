import { Response, Router } from "express";
import { blogCollection, postCollection } from "../../db/database";
import { HTTP_STATUS } from "../../core/const/statuses";

export const clearDbRouter = Router({});

clearDbRouter.delete("", async (_, res: Response) => {
  try {
    await Promise.all([
      blogCollection.deleteMany(),
      postCollection.deleteMany(),
    ]);
    res.sendStatus(HTTP_STATUS.noContent);
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
});
