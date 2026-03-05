import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/error.handler";
import { PostsQueryInput } from "../../types/post.types";
import { getMatchedQuery } from "../../../../core/utils/get-matched-query";
import { postsQueryRepository } from "../../repositories/posts.query.repository";

export const getPostsHandler = async (req: Request, res: Response) => {
  try {
    const matchedQuery = getMatchedQuery<PostsQueryInput>(req);
    const posts = await postsQueryRepository.getAll(matchedQuery);

    res.status(HTTP_STATUS.ok).send(posts);
  } catch (error) {
    errorHandler(error, res);
  }
};
