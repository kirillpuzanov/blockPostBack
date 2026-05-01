import { body } from "express-validator";
import { LikeStatus } from "../domain/like.types";

export const inputLikeStatusValidation = body("likeStatus")
  .trim()
  .isString()
  .withMessage("likeStatus must be a string")
  .isIn(Object.values(LikeStatus))
  .withMessage("incorrect like status");
