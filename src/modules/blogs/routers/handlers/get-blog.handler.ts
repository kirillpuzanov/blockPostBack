import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { BlogViewModel } from "../../types/blog.types";
import { errorHandler } from "../../../../core/errors/error.handler";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";

export const getBlogHandler = async (
  req: Request<{ id: string }, BlogViewModel | null>,
  res: Response,
) => {
  try {
    const blogView = await blogsQueryRepository.getById(req.params.id);

    res.status(HTTP_STATUS.ok).send(blogView);
  } catch (error) {
    errorHandler(error, res);
  }
};
