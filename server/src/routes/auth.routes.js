import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../validators/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";
import { login, register } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", validate({ body: registerSchema }), asyncHandler(register));
authRouter.post("/login", validate({ body: loginSchema }), asyncHandler(login));

