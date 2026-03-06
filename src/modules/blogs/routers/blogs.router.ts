import { Router } from "express";
import { getBlogsHandler } from "./handlers/get-blogs.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { inputBlogFieldValidation } from "../validation/input-blog.validation";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { BlogSortFields } from "../types/blog.types";
import { authAdminGuard } from "../../../auth/validation/auth-admin.guard";

export const blogsPublicRouter = Router({});
export const blogsAuthRouter = Router({});

blogsPublicRouter
  .get(
    "",
    pageSortValidation(BlogSortFields),
    validationResult,
    getBlogsHandler,
  )
  .get("/:id", handleIdValidation, validationResult, getBlogHandler);

blogsAuthRouter
  .post(
    "",
    authAdminGuard,
    inputBlogFieldValidation,
    validationResult,
    createBlogHandler,
  )

  .put(
    "/:id",
    authAdminGuard,
    handleIdValidation,
    inputBlogFieldValidation,
    validationResult,
    updateBlogHandler,
  )
  .delete(
    "/:id",
    authAdminGuard,
    handleIdValidation,
    validationResult,
    deleteBlogHandler,
  );
