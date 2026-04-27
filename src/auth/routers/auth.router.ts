import { Router } from "express";
import { loginValidation } from "../validation/login.validation";
import { validationResult } from "../../core/middlewares/validation-result";
import { routes } from "../../core/const/routes";
import { accessTokenGuard } from "../validation/access-token.guard";
import {
  emailValidation,
  recoveryPasswordValidation,
  registrationConfirmValidation,
  registrationValidation,
} from "../validation/registration.validation";
import { refreshTokenGuard } from "../validation/refresh-token.guard";
import { rateLimitGuard } from "../validation/rate-limit.guard";
import { authController } from "../../composition-root";

export const authRouter = Router({});

authRouter
  /** login */
  .post(
    routes.auth.login,
    rateLimitGuard,
    loginValidation,
    validationResult,
    authController.login.bind(authController),
  );

/** logout */
authRouter.post(
  routes.auth.logout,
  refreshTokenGuard,
  authController.logout.bind(authController),
);

/** refresh token */
authRouter.post(
  routes.auth.refreshToken,
  refreshTokenGuard,
  authController.refreshToken.bind(authController),
);

/** me */
authRouter.get(
  routes.auth.me,
  accessTokenGuard,
  authController.getMe.bind(authController),
);

/** registration */
authRouter.post(
  routes.auth.registration,
  rateLimitGuard,
  registrationValidation,
  validationResult,
  authController.registration.bind(authController),
);

authRouter.post(
  routes.auth.registrationConfirm,
  rateLimitGuard,
  registrationConfirmValidation,
  validationResult,
  authController.registrationConfirm.bind(authController),
);

authRouter.post(
  routes.auth.registrationResendCode,
  rateLimitGuard,
  emailValidation,
  validationResult,
  authController.registrationResendConfirm.bind(authController),
);

/** recovery pass */
authRouter
  .post(
    routes.auth.passwordRecovery,
    rateLimitGuard,
    emailValidation,
    validationResult,
    authController.recoveryPass.bind(authController),
  )

  .post(
    routes.auth.newPassword,
    rateLimitGuard,
    recoveryPasswordValidation,
    validationResult,
    authController.setNewPassword.bind(authController),
  );
