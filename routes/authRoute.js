import { Router } from "express";
import authController from "../controller/authController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const authRouter = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with user credentials
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
 *       500:
 *         description: A problem from our side :(
 */
authRouter.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/forgotPassword:
 *   post:
 *     summary: Route for getting OTP for forgot password
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
 *         description: Login successful
 *       400:
 *         description: Invalid Email address
 *       500:
 *         description: A problem from our side :(
 */
authRouter.post("/forgotPassword", authController.forgotPassword);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Route for user sign up
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
 *                 type: number
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
 *         description: User registration successful
 *       400:
 *         description: Invalid input provided
 *       500:
 *         description: A problem from our side :(
 */

authRouter.post("/signup", authController.signup);

// OTP Token Validator added as Middleware.
authRouter.post("/resetPassword", tokenValidator("OTP"), authController.resetPassword);
authRouter.post("/verifyUser", tokenValidator("OTP"), authController.verifyUser);

export default authRouter;
