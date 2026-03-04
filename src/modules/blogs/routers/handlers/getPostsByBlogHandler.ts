import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { BlogViewModel, PostsByBlogQueryInput } from "../../types/blog";
import { mapToPostView } from "../../../posts/routers/mappers/mapToPostView";
import { errorHandler } from "../../../../core/errors/errorHandler";
import { getMatchedQuery } from "../../../../core/utils/getMatchedQuery";
import { getPaginatedOutput } from "../../../../core/utils/getPaginatedOutput";
import { PageAndSort } from "../../../../core/types/pageAndSort";
import { blogsService } from "../../application/blogs.service";

export const getPostsByBlogHandler = async (
  req: Request<{ blogId: string }, PageAndSort<BlogViewModel>, {}>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;

    const matchedQuery = getMatchedQuery<PostsByBlogQueryInput>(req);
    const { pageNumber, pageSize } = matchedQuery;

    const { postsByBlog, totalCount } = await blogsService.getPostsByBlog(
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
