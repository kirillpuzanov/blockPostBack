import { body } from "express-validator";

export const inputCommentValidation = body("content")
  .isString()
  .withMessage("content must be string")
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("incorrect field length");
