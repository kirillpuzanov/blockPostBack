import { Request, Response } from "express";
import { postsRepository } from "../../repositories/postsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { createBaseError } from "../../../../core/utils/baseError";

export const deletePostHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const post = await postsRepository.getById(id);

    if (!post) {
      res
        .status(HTTP_STATUS.notFound)
        .send(createBaseError([{ field: "id", message: "post not found" }]));
      return;
    }
    await postsRepository.deleteById(id);
    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
