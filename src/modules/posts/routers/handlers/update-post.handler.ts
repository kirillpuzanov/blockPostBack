import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { PostInput, PostViewModel } from "../../types/post";
import { errorHandler } from "../../../../core/errors/error.handler";
import { postsService } from "../../application/posts.service";

export const updatePostHandler = async (
  req: Request<{ id: string }, PostViewModel, PostInput>,
  res: Response,
) => {
  try {
    await postsService.updatePost(req.body, req.params.id);

    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
};
