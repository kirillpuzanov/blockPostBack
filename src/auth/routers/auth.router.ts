import { Router } from "express";
import { loginGuard } from "../validation/login.guard";
import { validationResult } from "../../core/middlewares/validation-result";
import { loginHandler } from "./handlers/login.handler";

export const authRouter = Router({});

authRouter.post("/login", loginGuard, validationResult, loginHandler);
