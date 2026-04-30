import { Router } from "express";
import {
  handleBlogIdValidation,
  handleIdValidation,
} from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";
import { inputBlogFieldValidation } from "../validation/input-blog.validation";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { BlogSortFields } from "../domain/blog.types";
import { authAdminGuard } from "../../../auth/validation/auth-admin.guard";
import { PostsByBlogSortFields } from "../../posts/domain/post.types";
import { inputPostByBlogFieldValidation } from "../../posts/validation/input-post.validation";
import { container } from "../../../composition-root";
import { BlogsController } from "./blogs.controller";

export const blogsRouter = Router({});
const blogsController = container.get(BlogsController);

blogsRouter.get(
  "",
  pageSortValidation(BlogSortFields),
  validationResult,
  blogsController.getBlogs.bind(blogsController),
);

blogsRouter.get(
  "/:id",
  handleIdValidation,
  validationResult,
  blogsController.getBlog.bind(blogsController),
);

blogsRouter.get(
  "/:blogId/posts",
  handleBlogIdValidation,
  pageSortValidation(PostsByBlogSortFields),
  validationResult,
  blogsController.getPostsByBlog.bind(blogsController),
);

blogsRouter.post(
  "",
  authAdminGuard,
  inputBlogFieldValidation,
  validationResult,
  blogsController.createBlog.bind(blogsController),
);

blogsRouter.put(
  "/:id",
  authAdminGuard,
  handleIdValidation,
  inputBlogFieldValidation,
  validationResult,
  blogsController.updateBlog.bind(blogsController),
);

blogsRouter.delete(
  "/:id",
  authAdminGuard,
  handleIdValidation,
  validationResult,
  blogsController.deleteBlog.bind(blogsController),
);

blogsRouter.post(
  "/:blogId/posts",
  authAdminGuard,
  handleBlogIdValidation,
  inputPostByBlogFieldValidation,
  validationResult,
  blogsController.createPostByBlog.bind(blogsController),
);
