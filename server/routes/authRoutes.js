import express from "express";
import * as authController from "../controllers/authController.js";
import { asyncHandler } from "../config/helpers.js";
import { authenticateUser } from "../Middleware/auth.middlewares.js";
import { loginValidator, registerValidator } from "../validator/authValidator.js";
import { validateRequest } from "../Middleware/validation.middleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validateRequest,
  asyncHandler(authController.register)
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  asyncHandler(authController.login)
);

router.get(
  "/me",
  authenticateUser,
  asyncHandler(authController.getCurrentUser)
);

export default router;
