import { Router } from "express";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";
import { getCommentHandler } from "./handlers/get-comment.handler";

export const commentsPublicRouter = Router({});
export const commentsAuthRouter = Router({});

commentsPublicRouter.get(
  "/id",
  handleIdValidation,
  validationResult,
  getCommentHandler,
);
