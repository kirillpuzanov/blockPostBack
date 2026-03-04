import { body } from "express-validator";

const nameValidation = body("name")
  .isString()
  .withMessage("name must be string")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("incorrect field length");

const descriptionValidation = body("description")
  .isString()
  .withMessage("description must be string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("incorrect field length");

const urlValidation = body("websiteUrl")
  .isString()
  .withMessage("websiteUrl must be string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("incorrect field length")
  .isURL()
  .withMessage("incorrect url pattern")
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  .withMessage("incorrect url pattern");

export const inputBlogFieldValidation = [
  nameValidation,
  descriptionValidation,
  urlValidation,
];
