import { Router } from "express";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";
import { inputCommentValidation } from "../validation/input-comment.validation";
import { accessTokenGuard } from "../../../auth/validation/access-token.guard";
import { container } from "../../../composition-root";
import { CommentsController } from "./comments.controller";
import { optionalAccessGuard } from "../../../auth/validation/optional-access.guard";
import { inputLikeStatusValidation } from "../../like/validation/like.validation";

export const commentsRouter = Router({});
const commentsController = container.get(CommentsController);

commentsRouter.get(
  "/:id",
  optionalAccessGuard,
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

commentsRouter.put(
  "/:id/like-status",
  accessTokenGuard,
  handleIdValidation,
  inputLikeStatusValidation,
  validationResult,
  commentsController.updateLikeStatus.bind(commentsController),
);

commentsRouter.delete(
  "/:id",
  accessTokenGuard,
  handleIdValidation,
  validationResult,
  commentsController.deleteComment.bind(commentsController),
);
