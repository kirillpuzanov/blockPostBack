import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { createBaseError } from "../../../../core/utils/baseError";
import { BlogViewModel } from "../../types/blog";
import { mapToBlogView } from "../mappers/mapToBlogView";

export const getBlogHandler = async (
  req: Request<{ id: string }, BlogViewModel | null>,
  res: Response,
) => {
  try {
    const blog = await blogsRepository.getById(req.params.id);

    if (!blog) {
      res
        .status(HTTP_STATUS.notFound)
        .send(createBaseError([{ field: "id", message: "blog not found" }]));
      return;
    }
    const blogView = mapToBlogView(blog);
    res.status(HTTP_STATUS.ok).send(blogView);
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
