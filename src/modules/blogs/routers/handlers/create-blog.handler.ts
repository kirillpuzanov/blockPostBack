import { Request, Response } from "express";
import { BlogViewModel, CreateBlogInput } from "../../types/blog.types";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { errorHandler } from "../../../../core/errors/error.handler";
import { blogsService } from "../../application/blogs.service";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";

export const createBlogHandler = async (
  req: Request<{}, BlogViewModel, CreateBlogInput>,
  res: Response,
) => {
  try {
    const blogId = await blogsService.createBlog(req.body);
    const blogView = await blogsQueryRepository.getById(blogId);
    res.status(HTTP_STATUS.created).send(blogView);
  } catch (error) {
    errorHandler(error, res);
  }
};
