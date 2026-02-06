import { body } from "express-validator";

const titleValidation = body("title")
  .isString()
  .withMessage("title must be string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("incorrect field length");

const shortDescriptionValidation = body("shortDescription")
  .isString()
  .withMessage("shortDescription must be string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("incorrect field length");

const contentValidation = body("content")
  .isString()
  .withMessage("blogId must be string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("incorrect field length");

const blogIdValidation = body("blogId")
  .isString()
  .withMessage("blogId must be string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("incorrect field length");

export const inputPostFieldValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
