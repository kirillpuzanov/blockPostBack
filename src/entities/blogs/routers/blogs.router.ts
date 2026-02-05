import { Router } from "express";
import { getBlogsHandler } from "./handlers/getBlogsHandler";
import { getBlogHandler } from "./handlers/getBlogHandler";
import { idValidation } from "../../../core/middlewares/idValidation";
import { validationResult } from "../../../core/middlewares/validationResult";
import { authAdminGuardMiddleware } from "../../../auth/authAdminGuardMiddleware";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { updateBlogHandler } from "./handlers/updateBlogHandler";

export const blogsPublicRouter = Router({});
export const blogsAuthRouter = Router({});

blogsPublicRouter
  .get("", getBlogsHandler)
  .get("/:id", idValidation, validationResult, getBlogHandler);

blogsAuthRouter
  .post(
    "",
    authAdminGuardMiddleware,
    // валидация полей тела
    validationResult,
    createBlogHandler,
  )
  .put(
    "/:id",
    authAdminGuardMiddleware,
    idValidation,
    // валидация полей тела
    validationResult,
    updateBlogHandler,
  );
