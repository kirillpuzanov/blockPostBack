import { Router } from "express";
import { loginValidation } from "../validation/login.validation";
import { validationResult } from "../../core/middlewares/validation-result";
import { loginHandler } from "./handlers/login.handler";
import { routes } from "../../core/const/routes";
import { accessTokenGuard } from "../validation/access-token.guard";
import { getMeHandler } from "./handlers/get-me.handler";
import {
  emailValidation,
  registrationConfirmValidation,
  registrationValidation,
} from "../validation/registration.validation";
import { registrationHandler } from "./handlers/registration.handler";
import { registrationConfirmHandler } from "./handlers/registration-confirm.handler";
import { registrationResendConfirmHandler } from "./handlers/registration-resend-confirm.handler";
import { refreshTokenGuard } from "../validation/refresh-token.guard";
import { refreshTokenHandler } from "./handlers/refresh-token.handler";

export const authRouter = Router({});

authRouter
  /** login */
  .post(routes.auth.login, loginValidation, validationResult, loginHandler)

  /** refresh token */
  .post(routes.auth.refreshToken, refreshTokenGuard, refreshTokenHandler)

  /** me */
  .get(routes.auth.me, accessTokenGuard, getMeHandler)

  /** registration */
  .post(
    routes.auth.registration,
    registrationValidation,
    validationResult,
    registrationHandler,
  )
  .post(
    routes.auth.registrationConfirm,
    registrationConfirmValidation,
    validationResult,
    registrationConfirmHandler,
  )
  .post(
    routes.auth.registrationResendCode,
    emailValidation,
    validationResult,
    registrationResendConfirmHandler,
  );
