import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { createBaseError } from "../../../../core/utils/baseError";

export const deleteBlogHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.getById(id);

    if (!blog) {
      res
        .status(HTTP_STATUS.notFound)
        .send(createBaseError([{ field: "id", message: "blog not found" }]));
      return;
    }
    await blogsRepository.deleteById(id);
    res.sendStatus(HTTP_STATUS.noContent);
    return;
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
