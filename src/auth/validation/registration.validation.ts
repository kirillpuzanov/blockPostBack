import { body } from "express-validator";

const loginValidation = body("login")
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("incorrect login");

const passwordValidation = body("password")
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("incorrect password");

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

export const registrationValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
];

export const registrationConfirmValidation = body("code")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .isUUID(4) // todo - check
  .withMessage("incorrect confirmation code");
