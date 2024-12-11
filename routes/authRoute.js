import { Router } from "express";
import authController from "../controller/authController.js";
import { otpTokenValidator } from "../middleware/OTP/otpTokenValidator.js";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/forgotPassword", authController.forgotPassword);

authRouter.post("/signup", authController.signup);

// OTP Token Validator added as Middleware.
authRouter.post("/resetPassword", otpTokenValidator, authController.resetPassword);
authRouter.post("/verifyUser", otpTokenValidator, authController.verifyUser);

export default authRouter;
