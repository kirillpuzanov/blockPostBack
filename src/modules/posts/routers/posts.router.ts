import { Router } from "express";
import { authAdminGuardMiddleware } from "../../../auth/authAdminGuardMiddleware";
import { validationResult } from "../../../core/middlewares/validationResult";
import { handleIdValidation } from "../../../core/middlewares/idValidation";
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
  .get("/:id", handleIdValidation(), validationResult, getPostHandler);

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
    handleIdValidation(),
    inputPostFieldValidation,
    validationResult,
    updatePostHandler,
  )
  .delete(
    "/:id",
    authAdminGuardMiddleware,
    handleIdValidation(),
    validationResult,
    deletePostHandler,
  );
