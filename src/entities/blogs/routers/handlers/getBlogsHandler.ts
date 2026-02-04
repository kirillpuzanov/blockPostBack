import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";

export const getBlogsHandler = (_: Request, res: Response) => {
  const blogs = blogsRepository.getAll();
  res.status(HTTP_STATUS.ok).send(blogs);
};
