import { Router } from "express";
import { getBlogsHandler } from "./handlers/getBlogsHandler";
import { getBlogHandler } from "./handlers/getBlogHandler";
import {
  blogIdValidation,
  idValidation,
} from "../../../core/middlewares/idValidation";
import { validationResult } from "../../../core/middlewares/validationResult";
import { authAdminGuardMiddleware } from "../../../auth/authAdminGuardMiddleware";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { updateBlogHandler } from "./handlers/updateBlogHandler";
import { deleteBlogHandler } from "./handlers/deleteBlogHandler";
import { getBlogPostsHandler } from "./handlers/getBlogPostsHandler";
import { inputBlogFieldValidation } from "../validation/inputBlogValidation";
import { inputPostByBlogFieldValidation } from "../../posts/validation/inputPostValidation";
import { createBlogPostHandler } from "./handlers/createBlogPostHandler";

export const blogsPublicRouter = Router({});
export const blogsAuthRouter = Router({});

blogsPublicRouter
  .get("", getBlogsHandler)
  .get("/:id", idValidation, validationResult, getBlogHandler)
  .get(
    "/:blogId/posts",
    blogIdValidation,
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
    blogIdValidation,
    inputPostByBlogFieldValidation,
    validationResult,
    createBlogPostHandler,
  )
  .put(
    "/:id",
    authAdminGuardMiddleware,
    idValidation,
    inputBlogFieldValidation,
    validationResult,
    updateBlogHandler,
  )
  .delete(
    "/:id",
    authAdminGuardMiddleware,
    idValidation,
    validationResult,
    deleteBlogHandler,
  );
