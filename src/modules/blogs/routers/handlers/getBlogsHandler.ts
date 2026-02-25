import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { mapToBlogView } from "../mappers/mapToBlogView";
import { errorHandler } from "../../../../core/errors/errorHandler";
import { matchedData } from "express-validator";
import { BlogQueryInput } from "../../types/blog";
import { getPaginatedOutput } from "../../../../core/utils/getPaginatedOutput";

export const getBlogsHandler = async (req: Request, res: Response) => {
  try {
    const matchedQuery = matchedData<BlogQueryInput>(req, {
      locations: ["query"],
      includeOptionals: true,
    });
    const { pageNumber, pageSize } = matchedQuery;

    const { blogs, totalCount } = await blogsRepository.getAll({
      ...req.query,
      ...matchedQuery,
    });

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
