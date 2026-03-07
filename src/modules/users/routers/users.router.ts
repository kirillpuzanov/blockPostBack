import { Router } from "express";
import { pageSortValidation } from "../../../core/middlewares/page-sort-validation";
import { UsersSortFields } from "../types/user.types";
import { validationResult } from "../../../core/middlewares/validation-result";
import { getUsersHandler } from "./handlers/get-users.handler";

export const usersAuthRouter = Router({});

usersAuthRouter.get(
  "",
  pageSortValidation(UsersSortFields),
  validationResult,
  getUsersHandler,
);
