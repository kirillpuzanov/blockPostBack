import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/error.handler";
import { getMatchedQuery } from "../../../../core/utils/get-matched-query";
import { PageAndSortInput } from "../../../../core/types/page-and-sort";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import { PostsByBlogQueryInput, PostViewModel } from "../../types/post.types";

export const getPostsByBlogHandler = async (
  req: Request<{ blogId: string }, PageAndSortInput<PostViewModel>>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;
    const matchedQuery = getMatchedQuery<PostsByBlogQueryInput>(req);

    const postsByBlog = await postsQueryRepository.getPostsByBlog(
      blogId,
      matchedQuery,
    );
    res.status(HTTP_STATUS.ok).send(postsByBlog);
  } catch (error) {
    errorHandler(error, res);
  }
};
