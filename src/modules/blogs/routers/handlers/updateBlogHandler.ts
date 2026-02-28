import { Request, Response } from "express";
import { BlogInput, BlogViewModel } from "../../types/blog";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { blogsRepository } from "../../repositories/blogsRepository";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";

export const updateBlogHandler = async (
  req: Request<{ id: string }, BlogViewModel, BlogInput>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.getById(id);

    if (!blog) {
      throw new NotFoundError("blog not found", "id");
    }
    const { name, description, websiteUrl } = req.body;

    await blogsRepository.update({ name, description, websiteUrl }, id);

    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
};
