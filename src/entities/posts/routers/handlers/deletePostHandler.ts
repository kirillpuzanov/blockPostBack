import { Request, Response } from "express";
import { postsRepository } from "../../repositories/postsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { createBaseError } from "../../../../core/utils/baseError";

export const deletePostHandler = (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;
  const post = postsRepository.getById(id);

  if (!post) {
    res
      .status(HTTP_STATUS.notFound)
      .send(createBaseError([{ field: "id", message: "post not found" }]));
    return;
  }
  postsRepository.deleteById(id);
  res.sendStatus(HTTP_STATUS.noContent);
  return;
};
