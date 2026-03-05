import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/error.handler";
import { getMatchedQuery } from "../../../../core/utils/get-matched-query";
import { BlogQueryInput } from "../../types/blog.types";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";

export const getBlogsHandler = async (req: Request, res: Response) => {
  try {
    const matchedQuery = getMatchedQuery<BlogQueryInput>(req);
    const blogView = await blogsQueryRepository.getAll(matchedQuery);

    res.status(HTTP_STATUS.ok).send(blogView);
  } catch (error) {
    errorHandler(error, res);
  }
};
