import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { BlogViewModel } from "../../types/blog";
import { blogsRepository } from "../../repositories/blogsRepository";
import { createBaseError } from "../../../../core/utils/baseError";
import { mapToPostView } from "../../../posts/routers/mappers/mapToPostView";

export const getBlogPostsHandler = async (
  req: Request<{ blogId: string }, BlogViewModel, {}>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;
    const blog = await blogsRepository.getById(blogId);

    if (!blog) {
      res
        .status(HTTP_STATUS.notFound)
        .send(
          createBaseError([{ field: "blogId", message: "blog is not exists" }]),
        );
      return;
    }

    const blogPosts = await blogsRepository.getPostsByBlog(blogId);
    const blogPostsView = blogPosts.map((el) => mapToPostView(el));
    res.status(HTTP_STATUS.ok).send(blogPostsView);
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
