import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { BlogViewModel } from "../../types/blog";
import { mapToBlogView } from "../mappers/mapToBlogView";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";

export const getBlogHandler = async (
  req: Request<{ id: string }, BlogViewModel | null>,
  res: Response,
) => {
  try {
    const blog = await blogsRepository.getById(req.params.id);

    if (!blog) {
      throw new NotFoundError("blog not found", "id");
    }
    const blogView = mapToBlogView(blog);
    res.status(HTTP_STATUS.ok).send(blogView);
  } catch (error) {
    errorHandler(error, res);
  }
};
