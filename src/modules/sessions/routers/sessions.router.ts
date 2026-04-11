import { Router } from "express";
import { refreshTokenGuard } from "../../../auth/validation/refresh-token.guard";
import { getSessionsHandler } from "./handlers/get-sessions.handler";
import { deleteAllMySessionsHandler } from "./handlers/delete-all-my-sessions.handler";
import { deleteMySessionHandler } from "./handlers/delete-my-session.handler";
import { handleExistIdValidation } from "../../../core/middlewares/id-validation";
import { validationResult } from "../../../core/middlewares/validation-result";

export const sessionsRouter = Router({});

sessionsRouter
  .get("", refreshTokenGuard, getSessionsHandler)
  .delete("", refreshTokenGuard, deleteAllMySessionsHandler)
  .delete(
    "/:id",
    refreshTokenGuard,
    handleExistIdValidation,
    validationResult,
    deleteMySessionHandler,
  );
