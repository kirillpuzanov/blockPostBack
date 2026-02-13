import { Request, Response } from "express";
import { BlogInput, BlogViewModel } from "../../types/blog";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { blogsRepository } from "../../repositories/blogsRepository";
import { createBaseError } from "../../../../core/utils/baseError";

export const updateBlogHandler = async (
  req: Request<{ id: string }, BlogViewModel, BlogInput>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.getById(id);

    if (!blog) {
      res
        .status(HTTP_STATUS.notFound)
        .send(createBaseError([{ field: "id", message: "blog not found" }]));
    }
    const { name, description, websiteUrl } = req.body;
    await blogsRepository.update({ name, description, websiteUrl }, id);

    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
