import { Router } from "express";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";
import { inputCommentValidation } from "../validation/input-comment.validation";
import { accessTokenGuard } from "../../../auth/validation/access-token.guard";
import { container } from "../../../composition-root";
import { CommentsController } from "./comments.controller";

export const commentsRouter = Router({});
const commentsController = container.get(CommentsController);

commentsRouter.get(
  "/:id",
  handleIdValidation,
  validationResult,
  commentsController.getComment.bind(commentsController),
);

commentsRouter.put(
  "/:id",
  accessTokenGuard,
  handleIdValidation,
  inputCommentValidation,
  validationResult,
  commentsController.updateComment.bind(commentsController),
);

commentsRouter.delete(
  "/:id",
  accessTokenGuard,
  handleIdValidation,
  validationResult,
  commentsController.deleteComment.bind(commentsController),
);
