import { Request, Response } from "express";
import { Blog, BlogInputDTO } from "../../types/blog";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { blogsRepository } from "../../repositories/blogsRepository";
import { createBaseError } from "../../../../core/utils/baseError";
import { createNewBlog } from "../../utils";

export const updateBlogHandler = (
  req: Request<{ id: string }, Blog, BlogInputDTO>,
  res: Response,
) => {
  const id = req.params.id;
  const blog = blogsRepository.getById(id);

  if (!blog) {
    res
      .status(HTTP_STATUS.notFound)
      .send(createBaseError([{ field: "id", message: "blog not found" }]));
  }
  const updatedBlog = { ...createNewBlog(req.body), id };
  blogsRepository.update(updatedBlog);

  res.sendStatus(HTTP_STATUS.noContent);
  return;
};
