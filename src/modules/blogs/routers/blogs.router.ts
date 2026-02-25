import { Router } from "express";
import { getBlogsHandler } from "./handlers/getBlogsHandler";
import { getBlogHandler } from "./handlers/getBlogHandler";
import { handleIdValidation } from "../../../core/middlewares/idValidation";
import { validationResult } from "../../../core/middlewares/validationResult";
import { authAdminGuardMiddleware } from "../../../auth/authAdminGuardMiddleware";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { updateBlogHandler } from "./handlers/updateBlogHandler";
import { deleteBlogHandler } from "./handlers/deleteBlogHandler";
import { getBlogPostsHandler } from "./handlers/getBlogPostsHandler";
import { inputBlogFieldValidation } from "../validation/inputBlogValidation";
import { inputPostByBlogFieldValidation } from "../../posts/validation/inputPostValidation";
import { createBlogPostHandler } from "./handlers/createBlogPostHandler";
import { pageSortValidation } from "../../../core/middlewares/pageSortValidation";
import { BlogSortFields, PostBlogSortFields } from "../types/blog";

export const blogsPublicRouter = Router({});
export const blogsAuthRouter = Router({});

blogsPublicRouter
  .get(
    "",
    pageSortValidation(BlogSortFields),
    validationResult,
    getBlogsHandler,
  )
  .get("/:id", handleIdValidation(), validationResult, getBlogHandler)
  .get(
    "/:blogId/posts",
    handleIdValidation("blogId"),
    pageSortValidation(PostBlogSortFields),
    validationResult,
    getBlogPostsHandler,
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
    handleIdValidation("blogId"),
    inputPostByBlogFieldValidation,
    validationResult,
    createBlogPostHandler,
  )
  .put(
    "/:id",
    authAdminGuardMiddleware,
    handleIdValidation(),
    inputBlogFieldValidation,
    validationResult,
    updateBlogHandler,
  )
  .delete(
    "/:id",
    authAdminGuardMiddleware,
    handleIdValidation(),
    validationResult,
    deleteBlogHandler,
  );
