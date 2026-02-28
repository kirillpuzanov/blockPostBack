import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import {
  errorHandler,
  NotFoundError,
} from "../../../../core/errors/errorHandler";

export const deleteBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.getById(id);

    if (!blog) {
      throw new NotFoundError("blog not found", "id");
    }
    await blogsRepository.deleteById(id);
    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
};
