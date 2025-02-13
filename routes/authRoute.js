import { Router } from "express";
import authController from "../controller/authController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const authRouter = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with user credentials. Returns JWT Token on successful login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *               userPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
authRouter.post("/login", authController.login);
authRouter.post("/forgotPassword", authController.forgotPassword);

authRouter.post("/signup", authController.signup);

// OTP Token Validator added as Middleware.
authRouter.post(
    "/resetPassword",
    tokenValidator("OTP"),
    authController.resetPassword,
);
authRouter.post(
    "/verifyUser",
    tokenValidator("OTP"),
    authController.verifyUser,
);

export default authRouter;
