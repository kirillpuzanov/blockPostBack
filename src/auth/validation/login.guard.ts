import { body } from "express-validator";

const loginOrEmailValidation = body("loginOrEmail")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("incorrect loginOrEmail");

const passwordValidation = body("password")
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("incorrect password");

export const loginGuard = [loginOrEmailValidation, passwordValidation];
