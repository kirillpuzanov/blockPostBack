import { Request, Response } from "express";
import { Blog, BlogInputDTO } from "../../types/blog.type";
import { createNewBlog } from "../../utils";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { blogsRepository } from "../../repositories/blogsRepository";

export const createBlogHandler = (
  req: Request<{}, Blog, BlogInputDTO>,
  res: Response,
) => {
  const newBlog = createNewBlog(req.body);
  blogsRepository.add(newBlog);

  res.status(HTTP_STATUS.created).send(newBlog);
};
