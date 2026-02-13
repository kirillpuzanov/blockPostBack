import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { mapToBlogView } from "../mappers/mapToBlogView";

export const getBlogsHandler = async (_: Request, res: Response) => {
  try {
    const blogs = await blogsRepository.getAll();

    const blogsView = blogs.map((el) => mapToBlogView(el));

    res.status(HTTP_STATUS.ok).send(blogsView);
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
