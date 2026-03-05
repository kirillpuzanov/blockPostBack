import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { PostViewModel } from "../../types/post.types";
import { errorHandler } from "../../../../core/errors/error.handler";
import { postsQueryRepository } from "../../repositories/posts.query.repository";

export const getPostHandler = async (
  req: Request<{ id: string }, PostViewModel | null>,
  res: Response,
) => {
  try {
    const postView = await postsQueryRepository.getById(req.params.id);

    res.status(HTTP_STATUS.ok).send(postView);
  } catch (error) {
    errorHandler(error, res);
  }
};
