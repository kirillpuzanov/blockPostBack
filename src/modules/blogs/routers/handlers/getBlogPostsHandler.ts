import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { BlogViewModel } from "../../types/blog";
import { blogsRepository } from "../../repositories/blogsRepository";
import { mapToPostView } from "../../../posts/routers/mappers/mapToPostView";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";

export const getBlogPostsHandler = async (
  req: Request<{ blogId: string }, BlogViewModel, {}>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;
    const blog = await blogsRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundError("blog does not exists", "blogId");
    }

    const blogPosts = await blogsRepository.getPostsByBlog(blogId);
    const blogPostsView = blogPosts.map((el) => mapToPostView(el));
    res.status(HTTP_STATUS.ok).send(blogPostsView);
  } catch (error) {
    errorHandler(error, res);
  }
};
