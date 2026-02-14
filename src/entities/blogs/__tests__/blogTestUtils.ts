import request from "supertest";
import { routes } from "../../../core/const/routes";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { BlogInput, BlogViewModel } from "../types/blog";
import { Express } from "express";
import { generateAuthHeader } from "../../../core/utils/generateAuthHeader";

export const createBlog = async (
  app: Express,
  blog: BlogInput,
): Promise<BlogViewModel> => {
  const createdBlog = await request(app)
    .post(routes.blogs)
    .set(generateAuthHeader())
    .send(blog)
    .expect(HTTP_STATUS.created);

  return createdBlog.body;
};
