import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { postsRepository } from "../../repositories/postsRepository";
import { createBaseError } from "../../../../core/utils/baseError";
import { PostInput, PostViewModel } from "../../types/post";

export const updatePostHandler = async (
  req: Request<{ id: string }, PostViewModel, PostInput>,
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

    const { title, blogId, content, shortDescription } = req.body;

    await postsRepository.update(
      { title, blogId, content, shortDescription },
      id,
    );

    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
