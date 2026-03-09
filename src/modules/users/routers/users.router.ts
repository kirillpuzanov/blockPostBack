import { Router } from "express";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { UsersSortFields } from "../types/user.types";
import { validationResult } from "../../../core/middlewares/validation-result";
import { getUsersHandler } from "./handlers/get-users.handler";
import { authAdminGuard } from "../../../auth/validation/auth-admin.guard";
import { handleIdValidation } from "../../../core/middlewares/id-validation";
import { inputUserFieldValidation } from "../validations/input-user.validation";
import { createUserHandler } from "./handlers/create-user.handler";

export const usersAuthRouter = Router({});

usersAuthRouter
  .get(
    "",
    authAdminGuard,
    pageSortValidation(UsersSortFields),
    validationResult,
    getUsersHandler,
  )

  .post(
    "",
    authAdminGuard,
    inputUserFieldValidation,
    validationResult,
    createUserHandler,
  )
  .delete(
    "/:id",
    authAdminGuard,
    handleIdValidation,
    validationResult,
    // deleteUserHandler, todo
  );
