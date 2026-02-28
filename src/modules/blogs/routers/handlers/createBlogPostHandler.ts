import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { blogsRepository } from "../../repositories/blogsRepository";
import { PostDb, PostInput, PostViewModel } from "../../../posts/types/post";
import { postsRepository } from "../../../posts/repositories/postsRepository";
import { mapToPostView } from "../../../posts/routers/mappers/mapToPostView";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";

export const createBlogPostHandler = async (
  req: Request<{ blogId: string }, PostViewModel, Omit<PostInput, "blogId">>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;
    const blog = await blogsRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundError("blog does not exists", "blogId");
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
