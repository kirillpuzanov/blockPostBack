import { Request, Response } from "express";
import { BlogDb, BlogInput, BlogViewModel } from "../../types/blog";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { blogsRepository } from "../../repositories/blogsRepository";
import { mapToBlogView } from "../mappers/mapToBlogView";

export const createBlogHandler = async (
  req: Request<{}, BlogViewModel, BlogInput>,
  res: Response,
) => {
  try {
    const { websiteUrl, description, name } = req.body;
    const newBlog: BlogDb = {
      name,
      websiteUrl,
      description,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const createdBlog = await blogsRepository.add(newBlog);
    const blogView = mapToBlogView(createdBlog);
    res.status(HTTP_STATUS.created).send(blogView);
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
