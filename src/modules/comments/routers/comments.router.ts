import { Router } from "express";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";
import { inputCommentValidation } from "../validation/input-comment.validation";
import { accessTokenGuard } from "../../../auth/validation/access-token.guard";
import { commentsController } from "../../../composition-root";

export const commentsRouter = Router({});

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
