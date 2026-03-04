import { Router } from "express";
import { getBlogsHandler } from "./handlers/get-blogs.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import {
  handleBlogIdValidation,
  handleIdValidation,
} from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";
import { authAdminGuardMiddleware } from "../../../auth/authAdminGuardMiddleware";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { getPostsByBlogHandler } from "./handlers/get-posts-by-blog.handler";
import { inputBlogFieldValidation } from "../validation/input-blog.validation";
import { inputPostByBlogFieldValidation } from "../../posts/validation/input-post.validation";
import { createBlogPostHandler } from "./handlers/create-blog-post.handler";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { BlogSortFields, PostsByBlogSortFields } from "../types/blog";

export const blogsPublicRouter = Router({});
export const blogsAuthRouter = Router({});

blogsPublicRouter
  .get(
    "",
    pageSortValidation(BlogSortFields),
    validationResult,
    getBlogsHandler,
  )
  .get("/:id", handleIdValidation, validationResult, getBlogHandler)
  .get(
    "/:blogId/posts",
    handleBlogIdValidation,
    pageSortValidation(PostsByBlogSortFields),
    validationResult,
    getPostsByBlogHandler,
  );

blogsAuthRouter
  .post(
    "",
    authAdminGuardMiddleware,
    inputBlogFieldValidation,
    validationResult,
    createBlogHandler,
  )
  .post(
    "/:blogId/posts",
    authAdminGuardMiddleware,
    handleBlogIdValidation,
    inputPostByBlogFieldValidation,
    validationResult,
    createBlogPostHandler,
  )
  .put(
    "/:id",
    authAdminGuardMiddleware,
    handleIdValidation,
    inputBlogFieldValidation,
    validationResult,
    updateBlogHandler,
  )
  .delete(
    "/:id",
    authAdminGuardMiddleware,
    handleIdValidation,
    validationResult,
    deleteBlogHandler,
  );
