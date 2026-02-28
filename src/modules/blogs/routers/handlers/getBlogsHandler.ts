import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { mapToBlogView } from "../mappers/mapToBlogView";
import { errorHandler } from "../../../../core/errors/errorHandler";
import { getPaginatedOutput } from "../../../../core/utils/getPaginatedOutput";
import { getMatchedQuery } from "../../../../core/utils/getMatchedQuery";
import { BlogQueryInput } from "../../types/blog";

export const getBlogsHandler = async (req: Request, res: Response) => {
  try {
    const matchedQuery = getMatchedQuery<BlogQueryInput>(req);
    const { pageNumber, pageSize } = matchedQuery;

    const { blogs, totalCount } = await blogsRepository.getAll(matchedQuery);

    const blogsView = blogs.map((el) => mapToBlogView(el));
    const output = getPaginatedOutput(blogsView, {
      pageNumber,
      pageSize,
      totalCount,
    });

    res.status(HTTP_STATUS.ok).send(output);
  } catch (error) {
    errorHandler(error, res);
  }
};
