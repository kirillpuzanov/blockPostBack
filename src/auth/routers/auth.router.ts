import { Router } from "express";
import { loginValidation } from "../validation/login.validation";
import { validationResult } from "../../core/middlewares/validation-result";
import { loginHandler } from "./handlers/login.handler";

export const authRouter = Router({});

authRouter.post("/login", loginValidation, validationResult, loginHandler);
