import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { postsRepository } from "../../repositories/postsRepository";
import { PostDb, PostInput, PostViewModel } from "../../types/post";
import { blogsRepository } from "../../../blogs/repositories/blogsRepository";
import { mapToPostView } from "../mappers/mapToPostView";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";

export const createPostHandler = async (
  req: Request<{}, PostViewModel, PostInput>,
  res: Response,
) => {
  try {
    const { blogId } = req.body;
    const blog = await blogsRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundError("blog not found", "blogId");
    }
    const { content, shortDescription, title } = req.body;
    const newPost: PostDb = {
      blogId,
      content,
      shortDescription,
      title,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    const createdPost = await postsRepository.add(newPost);
    const postView = mapToPostView(createdPost);

    res.status(HTTP_STATUS.created).send(postView);
  } catch (error) {
    errorHandler(error, res);
  }
};
