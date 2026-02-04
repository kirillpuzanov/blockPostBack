import { param } from "express-validator";

export const idValidation = param("id")
  .exists()
  .withMessage("id is required")
  .isString()
  .withMessage("id is not valid type")
  .isLength({ min: 1, max: 100 })
  .withMessage("id is not valid length");
