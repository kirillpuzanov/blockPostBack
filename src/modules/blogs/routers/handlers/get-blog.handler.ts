import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { BlogViewModel } from "../../types/blog";
import { mapToBlogView } from "../mappers/map-to-blog-view";
import { errorHandler } from "../../../../core/errors/errorHandler";
import { blogsService } from "../../application/blogs.service";

export const getBlogHandler = async (
  req: Request<{ id: string }, BlogViewModel | null>,
  res: Response,
) => {
  try {
    const blog = await blogsService.getById(req.params.id);

    const blogView = mapToBlogView(blog);
    res.status(HTTP_STATUS.ok).send(blogView);
  } catch (error) {
    errorHandler(error, res);
  }
};
