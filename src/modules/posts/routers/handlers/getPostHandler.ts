import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { PostViewModel } from "../../types/post";
import { postsRepository } from "../../repositories/postsRepository";
import { mapToPostView } from "../mappers/mapToPostView";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";

export const getPostHandler = async (
  req: Request<{ id: string }, PostViewModel | null>,
  res: Response,
) => {
  try {
    const post = await postsRepository.getById(req.params.id);

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }

    const postView = mapToPostView(post);
    res.status(HTTP_STATUS.ok).send(postView);
  } catch (error) {
    errorHandler(error, res);
  }
};
