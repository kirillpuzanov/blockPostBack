import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/error.handler";
import { postsService } from "../../application/posts.service";

export const deletePostHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await postsService.deletePost(req.params.id);
    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
};
