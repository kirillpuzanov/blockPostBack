import { Router } from "express";
import { authAdminGuardMiddleware } from "../../../auth/authAdminGuardMiddleware";
import { validationResult } from "../../../core/middlewares/validation-result";
import {
  handleBlogIdValidation,
  handleIdValidation,
} from "../../../core/middlewares/id-validation";
import { getPostHandler } from "./handlers/get-post.handler";
import { getPostsHandler } from "./handlers/get-posts.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import {
  inputPostByBlogFieldValidation,
  inputPostFieldValidation,
} from "../validation/input-post.validation";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { PostsByBlogSortFields, PostSortFields } from "../types/post.types";
import { getPostsByBlogHandler } from "./handlers/get-posts-by-blog.handler";
import { createPostByBlogHandler } from "./handlers/create-post-by-blog.handler";

export const postsPublicRouter = Router({});
export const postsAuthRouter = Router({});

export const postsBlogPublicRouter = Router({});
export const postsBlogAuthRouter = Router({});

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

postsBlogPublicRouter.get(
  "/:blogId/posts",
  handleBlogIdValidation,
  pageSortValidation(PostsByBlogSortFields),
  validationResult,
  getPostsByBlogHandler,
);

postsBlogAuthRouter.post(
  "/:blogId/posts",
  authAdminGuardMiddleware,
  handleBlogIdValidation,
  inputPostByBlogFieldValidation,
  validationResult,
  createPostByBlogHandler,
);
