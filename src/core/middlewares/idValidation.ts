import { param } from "express-validator";

export const idValidation = param("id")
  .exists()
  .withMessage("id is required")
  .isString()
  .withMessage("id is not valid type")
  .isMongoId()
  .withMessage("incorrect format of ObjectId");

export const blogIdValidation = param("blogId")
  .exists()
  .withMessage("id is required")
  .isString()
  .withMessage("id is not valid type")
  .isMongoId()
  .withMessage("incorrect format of ObjectId");
