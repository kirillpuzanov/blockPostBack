import { Router } from "express";
import { authAdminGuardMiddleware } from "../../../auth/authAdminGuardMiddleware";
import { validationResult } from "../../../core/middlewares/validation-result";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { getPostHandler } from "./handlers/get-post.handler";
import { getPostsHandler } from "./handlers/get-posts.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { inputPostFieldValidation } from "../validation/input-post.validation";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { PostSortFields } from "../types/post";

export const postsPublicRouter = Router({});
export const postsAuthRouter = Router({});

postsPublicRouter
  .get(
    "",
    pageSortValidation(PostSortFields),
    validationResult,
    getPostsHandler,
  )
  .get("/:id", handleIdValidation, validationResult, getPostHandler);

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
    handleIdValidation,
    inputPostFieldValidation,
    validationResult,
    updatePostHandler,
  )
  .delete(
    "/:id",
    authAdminGuardMiddleware,
    handleIdValidation,
    validationResult,
    deletePostHandler,
  );
