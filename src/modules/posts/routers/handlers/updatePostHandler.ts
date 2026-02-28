import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { postsRepository } from "../../repositories/postsRepository";
import { PostInput, PostViewModel } from "../../types/post";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";

export const updatePostHandler = async (
  req: Request<{ id: string }, PostViewModel, PostInput>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const post = await postsRepository.getById(id);

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }

    const { title, blogId, content, shortDescription } = req.body;

    await postsRepository.update(
      { title, blogId, content, shortDescription },
      id,
    );

    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
};
