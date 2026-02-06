import { Router } from "express";
import { authAdminGuardMiddleware } from "../../../auth/authAdminGuardMiddleware";
import { validationResult } from "../../../core/middlewares/validationResult";
import { idValidation } from "../../../core/middlewares/idValidation";
import { getPostHandler } from "./handlers/getPostHandler";
import { getPostsHandler } from "./handlers/getPostsHandler";
import { createPostHandler } from "./handlers/createPostHandler";
import { updatePostHandler } from "./handlers/updatePostHandler";
import { deletePostHandler } from "./handlers/deletePostHandler";
import { inputPostFieldValidation } from "../validation/inputPostValidation";

export const postsPublicRouter = Router({});
export const postsAuthRouter = Router({});

postsPublicRouter
  .get("", getPostsHandler)
  .get("/:id", idValidation, validationResult, getPostHandler);

postsAuthRouter
  .post(
    "",
    authAdminGuardMiddleware,
    inputPostFieldValidation,
    validationResult,
    createPostHandler,
  )
  .put(
    "/:id",
    authAdminGuardMiddleware,
    idValidation,
    inputPostFieldValidation,
    validationResult,
    updatePostHandler,
  )
  .delete(
    "/:id",
    authAdminGuardMiddleware,
    idValidation,
    validationResult,
    deletePostHandler,
  );
