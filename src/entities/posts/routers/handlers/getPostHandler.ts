import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { createBaseError } from "../../../../core/utils/baseError";
import { PostViewModel } from "../../types/post";
import { postsRepository } from "../../repositories/postsRepository";
import { mapToPostView } from "../mappers/mapToPostView";

export const getPostHandler = async (
  req: Request<{ id: string }, PostViewModel | null>,
  res: Response,
) => {
  try {
    const post = await postsRepository.getById(req.params.id);

    if (!post) {
      res
        .status(HTTP_STATUS.notFound)
        .send(createBaseError([{ field: "id", message: "post not found" }]));
      return;
    }

    const postView = mapToPostView(post);
    res.status(HTTP_STATUS.ok).send(postView);
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
