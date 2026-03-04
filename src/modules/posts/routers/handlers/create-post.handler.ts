import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { PostInput, PostViewModel } from "../../types/post";
import { mapToPostView } from "../mappers/map-to-post-view";
import { errorHandler } from "../../../../core/errors/error.handler";
import { postsService } from "../../application/posts.service";

export const createPostHandler = async (
  req: Request<{}, PostViewModel, PostInput>,
  res: Response,
) => {
  try {
    const createdPost = await postsService.createPost(req.body);
    const postView = mapToPostView(createdPost);

    res.status(HTTP_STATUS.created).send(postView);
  } catch (error) {
    errorHandler(error, res);
  }
};
