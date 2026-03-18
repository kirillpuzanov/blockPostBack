import { Router } from "express";
import { loginValidation } from "../validation/login.validation";
import { validationResult } from "../../core/middlewares/validation-result";
import { loginHandler } from "./handlers/login.handler";
import { routes } from "../../core/const/routes";
import { accessTokenGuard } from "../validation/access-token.guard";
import { getMeHandler } from "./handlers/get-me.handler";
import { registrationValidation } from "../validation/registration.validation";
import { registrationHandler } from "./handlers/registration.handler";

export const authRouter = Router({});

authRouter
  .post(routes.auth.login, loginValidation, validationResult, loginHandler)
  .get(routes.auth.me, accessTokenGuard, getMeHandler)
  .post(
    routes.auth.registration,
    registrationValidation,
    validationResult,
    registrationHandler,
  );
// .post(routes.auth.registrationConfirm)
// .post(routes.auth.registrationResendCode);
