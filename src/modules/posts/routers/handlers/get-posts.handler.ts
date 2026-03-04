import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { mapToPostView } from "../mappers/map-to-post-view";
import { errorHandler } from "../../../../core/errors/error.handler";
import { PostsQueryInput } from "../../types/post";
import { getMatchedQuery } from "../../../../core/utils/get-matched-query";
import { getPaginatedOutput } from "../../../../core/utils/get-paginated-output";
import { postsService } from "../../application/posts.service";

export const getPostsHandler = async (req: Request, res: Response) => {
  try {
    const matchedQuery = getMatchedQuery<PostsQueryInput>(req);
    const { pageNumber, pageSize } = matchedQuery;

    const { posts, totalCount } = await postsService.getAll(matchedQuery);
    const postsView = posts.map(mapToPostView);
    const output = getPaginatedOutput(postsView, {
      pageNumber,
      pageSize,
      totalCount,
    });

    res.status(HTTP_STATUS.ok).send(output);
  } catch (error) {
    errorHandler(error, res);
  }
};
