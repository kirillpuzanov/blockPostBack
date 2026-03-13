import { body } from "express-validator";

const inputCommentValidation = body("content")
  .isString()
  .withMessage("content must be string")
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("incorrect field length");
