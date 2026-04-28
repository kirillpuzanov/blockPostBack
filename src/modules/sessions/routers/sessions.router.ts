import { Router } from "express";
import { refreshTokenGuard } from "../../../auth/validation/refresh-token.guard";
import { handleExistIdValidation } from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";
import { container } from "../../../composition-root";
import { SessionsController } from "./sessions.controller";

export const sessionsRouter = Router({});
const sessionsController = container.get(SessionsController);

sessionsRouter.get(
  "",
  refreshTokenGuard,
  sessionsController.getSessions.bind(sessionsController),
);

sessionsRouter.delete(
  "",
  refreshTokenGuard,
  sessionsController.deleteAllMySessions.bind(sessionsController),
);

sessionsRouter.delete(
  "/:id",
  refreshTokenGuard,
  handleExistIdValidation,
  validationResult,
  sessionsController.deleteMySession.bind(sessionsController),
);
