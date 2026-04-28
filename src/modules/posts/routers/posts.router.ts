import { Router } from "express";
import { authAdminGuard } from "../../../auth/validation/auth-admin.guard";
import { validationResult } from "../../../core/middlewares/validation-result";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { inputPostFieldValidation } from "../validation/input-post.validation";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { PostSortFields } from "../types/post.types";
import { CommentsSortFields } from "../../comments/types/comment.types";
import { accessTokenGuard } from "../../../auth/validation/access-token.guard";
import { inputCommentValidation } from "../../comments/validation/input-comment.validation";
import { container } from "../../../composition-root";
import { PostsController } from "./posts.controller";

export const postsRouter = Router({});
const postsController = container.get(PostsController);

postsRouter.get(
  "",
  pageSortValidation(PostSortFields),
  validationResult,
  postsController.getPosts.bind(postsController),
);

postsRouter.get(
  "/:id",
  handleIdValidation,
  validationResult,
  postsController.getPost.bind(postsController),
);

postsRouter.get(
  "/:id/comments",
  handleIdValidation,
  pageSortValidation(CommentsSortFields),
  validationResult,
  postsController.getCommentsByPost.bind(postsController),
);

postsRouter.post(
  "",
  authAdminGuard,
  inputPostFieldValidation,
  validationResult,
  postsController.createPost.bind(postsController),
);

postsRouter.put(
  "/:id",
  authAdminGuard,
  handleIdValidation,
  inputPostFieldValidation,
  validationResult,
  postsController.updatePost.bind(postsController),
);
postsRouter.delete(
  "/:id",
  authAdminGuard,
  handleIdValidation,
  validationResult,
  postsController.deletePost.bind(postsController),
);

postsRouter.post(
  "/:id/comments",
  accessTokenGuard,
  inputCommentValidation,
  validationResult,
  postsController.createCommentByPost.bind(postsController),
);
