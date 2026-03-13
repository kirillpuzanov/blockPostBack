import { Router } from "express";
import { authAdminGuard } from "../../../auth/validation/auth-admin.guard";
import { validationResult } from "../../../core/middlewares/validation-result";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { getPostHandler } from "./handlers/get-post.handler";
import { getPostsHandler } from "./handlers/get-posts.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { inputPostFieldValidation } from "../validation/input-post.validation";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { PostSortFields } from "../types/post.types";

export const postsPublicRouter = Router({});
export const postsAdminAuthRouter = Router({});

postsPublicRouter
  .get(
    "",
    pageSortValidation(PostSortFields),
    validationResult,
    getPostsHandler,
  )
  .get("/:id", handleIdValidation, validationResult, getPostHandler);

postsAdminAuthRouter
  .post(
    "",
    authAdminGuard,
    inputPostFieldValidation,
    validationResult,
    createPostHandler,
  )
  .put(
    "/:id",
    authAdminGuard,
    handleIdValidation,
    inputPostFieldValidation,
    validationResult,
    updatePostHandler,
  )
  .delete(
    "/:id",
    authAdminGuard,
    handleIdValidation,
    validationResult,
    deletePostHandler,
  );
