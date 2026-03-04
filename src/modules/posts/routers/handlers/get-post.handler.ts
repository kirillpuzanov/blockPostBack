import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { PostViewModel } from "../../types/post";
import { mapToPostView } from "../mappers/map-to-post-view";
import { errorHandler } from "../../../../core/errors/error.handler";
import { postsService } from "../../application/posts.service";

export const getPostHandler = async (
  req: Request<{ id: string }, PostViewModel | null>,
  res: Response,
) => {
  try {
    const post = await postsService.getById(req.params.id);
    const postView = mapToPostView(post);
    res.status(HTTP_STATUS.ok).send(postView);
  } catch (error) {
    errorHandler(error, res);
  }
};
