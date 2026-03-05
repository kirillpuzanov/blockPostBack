import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { CreatePostInput, PostViewModel } from "../../types/post.types";
import { errorHandler } from "../../../../core/errors/error.handler";
import { postsService } from "../../application/posts.service";
import { postsQueryRepository } from "../../repositories/posts.query.repository";

export const createPostHandler = async (
  req: Request<{}, PostViewModel, CreatePostInput>,
  res: Response,
) => {
  try {
    const postId = await postsService.createPost(req.body);
    const postView = await postsQueryRepository.getById(postId);

    res.status(HTTP_STATUS.created).send(postView);
  } catch (error) {
    errorHandler(error, res);
  }
};
