import { Router } from "express";
import { getBlogsHandler } from "./handlers/getBlogsHandler";
import { getBlogHandler } from "./handlers/getBlogHandler";
import { idValidation } from "../../../core/middlewares/idValidation";
import { validationResult } from "../../../core/middlewares/validationResult";
import { authAdminGuardMiddleware } from "../../../auth/authAdminGuardMiddleware";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { updateBlogHandler } from "./handlers/updateBlogHandler";
import { deleteBlogHandler } from "./handlers/deleteBlogHandler";
import { inputBlogFieldValidation } from "../validation/inputBlogValidation";

export const blogsPublicRouter = Router({});
export const blogsAuthRouter = Router({});

blogsPublicRouter
  .get("", getBlogsHandler)
  .get("/:id", idValidation, validationResult, getBlogHandler);

blogsAuthRouter
  .post(
    "",
    authAdminGuardMiddleware,
    inputBlogFieldValidation,
    validationResult,
    createBlogHandler,
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
