import { Router } from "express";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { UsersSortFields } from "../domain/user.types";
import { validationResult } from "../../../core/middlewares/validation-result";
import { authAdminGuard } from "../../../auth/validation/auth-admin.guard";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { inputUserFieldValidation } from "../validations/input-user.validation";
import { container } from "../../../composition-root";
import { UsersController } from "./users.controller";

export const usersRouter = Router({});
const usersController = container.get(UsersController);

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
