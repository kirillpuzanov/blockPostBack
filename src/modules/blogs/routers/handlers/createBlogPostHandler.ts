import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { PostInput, PostViewModel } from "../../../posts/types/post";
import { mapToPostView } from "../../../posts/routers/mappers/mapToPostView";
import { errorHandler } from "../../../../core/errors/errorHandler";
import { blogsService } from "../../application/blogs.sservice";

export const createBlogPostHandler = async (
  req: Request<{ blogId: string }, PostViewModel, Omit<PostInput, "blogId">>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;

    const createdPost = await blogsService.createPostByBlog(blogId, req.body);
    const postView = mapToPostView(createdPost);

    res.status(HTTP_STATUS.created).send(postView);
  } catch (error) {
    errorHandler(error, res);
  }
};
