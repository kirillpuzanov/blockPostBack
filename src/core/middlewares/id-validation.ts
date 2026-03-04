import { param } from "express-validator";

export const handleIdValidation = param("id")
  .exists()
  .withMessage(`id is required`)
  .isString()
  .withMessage(`id is not valid type`)
  .isMongoId()
  .withMessage("incorrect format of ObjectId");

export const handleBlogIdValidation = param("blogId")
  .exists()
  .withMessage(`blogId is required`)
  .isString()
  .withMessage(`blogId is not valid type`)
  .isMongoId()
  .withMessage("incorrect format of ObjectId");
