import { body } from "express-validator";

const loginValidation = body("login")
  .isString()
  .withMessage("login must be string")
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("incorrect field length")
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("incorrect login");

const emailValidation = body("email")
  .isString()
  .withMessage("email must be string")
  .trim()
  .isLength({ min: 3 })
  .withMessage("incorrect field length")
  .isEmail()
  .withMessage("incorrect email")
  .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
  .withMessage("incorrect email");

const passwordValidation = body("password")
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("incorrect password");

export const inputUserFieldValidation = [
  loginValidation,
  emailValidation,
  passwordValidation,
];
