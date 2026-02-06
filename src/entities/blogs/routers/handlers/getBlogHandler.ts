import { Request, Response } from "express";
import { Blog } from "../../types/blog";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { createBaseError } from "../../../../core/utils/baseError";

export const getBlogHandler = (
  req: Request<{ id: string }, Blog | null>,
  res: Response,
) => {
  const blog = blogsRepository.getById(req.params.id);

  if (!blog) {
    res
      .status(HTTP_STATUS.notFound)
      .send(createBaseError([{ field: "id", message: "blog not found" }]));
    return;
  }
  res.status(HTTP_STATUS.ok).send(blog);
};
