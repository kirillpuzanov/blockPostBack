import { Router } from "express";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";
import { getCommentHandler } from "./handlers/get-comment.handler";
import { inputCommentValidation } from "../validation/input-comment.validation";
import { accessTokenGuard } from "../../../auth/validation/access-token.guard";
import { updateCommentHandler } from "./handlers/update-comment.handler";

export const commentsPublicRouter = Router({});
export const commentsAuthRouter = Router({});

commentsPublicRouter.get(
  "/:id",
  handleIdValidation,
  validationResult,
  getCommentHandler,
);

commentsAuthRouter
  .put(
    "/:id",
    accessTokenGuard,
    handleIdValidation,
    inputCommentValidation,
    validationResult,
    updateCommentHandler,
  )
  .delete("/:id", handleIdValidation, validationResult);
