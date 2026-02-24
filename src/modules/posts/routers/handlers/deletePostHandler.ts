import { Request, Response } from "express";
import { postsRepository } from "../../repositories/postsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";

export const deletePostHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const post = await postsRepository.getById(id);

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }
    await postsRepository.deleteById(id);
    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
};
