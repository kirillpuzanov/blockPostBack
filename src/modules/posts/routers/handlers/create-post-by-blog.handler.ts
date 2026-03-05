import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { CreatePostByBlogInput, PostViewModel } from "../../types/post.types";
import { errorHandler } from "../../../../core/errors/error.handler";
import { postsService } from "../../application/posts.service";
import { postsQueryRepository } from "../../repositories/posts.query.repository";

export const createPostByBlogHandler = async (
  req: Request<{ blogId: string }, PostViewModel, CreatePostByBlogInput>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;
    const { content, shortDescription, title } = req.body;

    const createdPostId = await postsService.createPost({
      content,
      shortDescription,
      title,
      blogId,
    });
    const postView = await postsQueryRepository.getById(createdPostId);

    res.status(HTTP_STATUS.created).send(postView);
  } catch (error) {
    errorHandler(error, res);
  }
};
