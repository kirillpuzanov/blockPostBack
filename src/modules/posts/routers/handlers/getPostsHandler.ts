import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { mapToPostView } from "../mappers/mapToPostView";
import { errorHandler } from "../../../../core/errors/errorHandler";
import { PostsQueryInput } from "../../types/post";
import { getMatchedQuery } from "../../../../core/utils/getMatchedQuery";
import { getPaginatedOutput } from "../../../../core/utils/getPaginatedOutput";
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
