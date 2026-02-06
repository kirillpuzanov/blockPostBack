import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { createBaseError } from "../../../../core/utils/baseError";
import { Post } from "../../types/post";
import { postsRepository } from "../../repositories/postsRepository";

export const getPostHandler = (
  req: Request<{ id: string }, Post | null>,
  res: Response,
) => {
  const post = postsRepository.getById(req.params.id);

  if (!post) {
    res
      .status(HTTP_STATUS.notFound)
      .send(createBaseError([{ field: "id", message: "post not found" }]));
    return;
  }
  res.status(HTTP_STATUS.ok).send(post);
};
