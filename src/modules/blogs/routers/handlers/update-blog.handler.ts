import { Request, Response } from "express";
import { BlogInput, BlogViewModel } from "../../types/blog";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/error.handler";
import { blogsService } from "../../application/blogs.service";

export const updateBlogHandler = async (
  req: Request<{ id: string }, BlogViewModel, BlogInput>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    await blogsService.updateBlog(req.body, id);

    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
};
