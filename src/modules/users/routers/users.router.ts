import { Router } from "express";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { UsersSortFields } from "../types/user.types";
import { validationResult } from "../../../core/middlewares/validation-result";
import { authAdminGuard } from "../../../auth/validation/auth-admin.guard";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { inputUserFieldValidation } from "../validations/input-user.validation";
import { usersController } from "../../../composition-root";

export const usersRouter = Router({});

usersRouter.get(
  "",
  authAdminGuard,
  pageSortValidation(UsersSortFields),
  validationResult,
  usersController.getUsers.bind(usersController),
);

usersRouter.post(
  "",
  authAdminGuard,
  inputUserFieldValidation,
  validationResult,
  usersController.createUser.bind(usersController),
);

usersRouter.delete(
  "/:id",
  authAdminGuard,
  handleIdValidation,
  validationResult,
  usersController.deleteUser.bind(usersController),
);
