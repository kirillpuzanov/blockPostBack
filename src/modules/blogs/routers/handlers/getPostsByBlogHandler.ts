import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { BlogViewModel, PostsByBlogQueryInput } from "../../types/blog";
import { blogsRepository } from "../../repositories/blogsRepository";
import { mapToPostView } from "../../../posts/routers/mappers/mapToPostView";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";
import { getMatchedQuery } from "../../../../core/utils/getMatchedQuery";
import { getPaginatedOutput } from "../../../../core/utils/getPaginatedOutput";

export const getPostsByBlogHandler = async (
  req: Request<{ blogId: string }, BlogViewModel, {}>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;
    const blog = await blogsRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundError("blog does not exists", "blogId");
    }

    const matchedQuery = getMatchedQuery<PostsByBlogQueryInput>(req);
    const { pageNumber, pageSize } = matchedQuery;

    const { postsByBlog, totalCount } = await blogsRepository.getPostsByBlog(
      blogId,
      matchedQuery,
    );

    const blogPostsView = postsByBlog.map(mapToPostView);
    const output = getPaginatedOutput(blogPostsView, {
      pageNumber,
      pageSize,
      totalCount,
    });

    res.status(HTTP_STATUS.ok).send(output);
  } catch (error) {
    errorHandler(error, res);
  }
};
