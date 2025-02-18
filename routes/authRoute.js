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

/**
 * @swagger
 * /api/auth/forgotPassword:
 *   post:
 *     summary: Request a password reset OTP.
 *     description: Sends an OTP to the user's email for password reset.
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
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: User email does not exist
 *       500:
 *         description: A problem from our side :(
 */

authRouter.post("/forgotPassword", authController.forgotPassword);
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user account.
 *     description: Creates a new user, stores credentials, and sends an OTP for email verification.
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
 *               userName:
 *                 type: string
 *               rollNumber:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               collegeName:
 *                 type: string
 *               collegeCity:
 *                 type: string
 *               userDepartment:
 *                 type: string
 *               academicYear:
 *                 type: integer
 *               degree:
 *                 type: string
 *               needAccommodationDay1:
 *                 type: boolean
 *               needAccommodationDay2:
 *                 type: boolean
 *               needAccommodationDay3:
 *                 type: boolean
 *               isAmrita:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User registered successfully. OTP sent for verification.
 *       400:
 *         description: Email already exists or invalid data.
 *       500:
 *         description: A problem from our side :(.
 */

authRouter.post("/signup", authController.signup);

// OTP Token Validator added as Middleware.
/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     summary: Reset user password using OTP.
 *     description: Validates OTP and allows the user to reset their password.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *               userPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: A problem from our side :(
 */
authRouter.post(
    "/resetPassword",
    tokenValidator("OTP"),
    authController.resetPassword,
);

/**
 * @swagger
 * /api/auth/verifyUser:
 *   post:
 *     summary: Verify user email using OTP.
 *     description: Confirms user identity by verifying OTP sent to email.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: User verification successful
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: A problem from our side :(
 */
authRouter.post(
    "/verifyUser",
    tokenValidator("OTP"),
    authController.verifyUser,
);

authRouter.post("/reVerifyUser", authController.reVerifyUser);

export default authRouter;
