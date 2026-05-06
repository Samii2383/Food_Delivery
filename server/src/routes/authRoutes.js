import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../validators/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/register", validate({ body: registerSchema }), asyncHandler(registerUser));
authRoutes.post("/login", validate({ body: loginSchema }), asyncHandler(loginUser));

export default authRoutes;

