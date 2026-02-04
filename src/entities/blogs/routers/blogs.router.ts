import { Router } from "express";
import { getBlogsHandler } from "./handlers/getBlogsHandler";
import { getBlogHandler } from "./handlers/getBlogHandler";
import { idValidation } from "../../../core/middlewares/idValidation";
import { validationResult } from "../../../core/middlewares/validationResult";

export const blogsPublicRouter = Router({});
export const blogsAuthRouter = Router({});

blogsPublicRouter
  .get("", getBlogsHandler)
  .get("/:id", idValidation, validationResult, getBlogHandler);
