import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/errorHandler";
import { blogsService } from "../../application/blogs.service";

export const deleteBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    await blogsService.deleteBlog(id);
    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
};
