import { Request, Response } from "express";
import { BlogInput, BlogViewModel } from "../../types/blog";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { mapToBlogView } from "../mappers/map-to-blog-view";
import { errorHandler } from "../../../../core/errors/error.handler";
import { blogsService } from "../../application/blogs.service";

export const createBlogHandler = async (
  req: Request<{}, BlogViewModel, BlogInput>,
  res: Response,
) => {
  try {
    const createdBlog = await blogsService.createBlog(req.body);
    const blogView = mapToBlogView(createdBlog);

    res.status(HTTP_STATUS.created).send(blogView);
  } catch (error) {
    errorHandler(error, res);
  }
};
