import { Router } from "express";
import authController from "../controller/authController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/forgotPassword", authController.forgotPassword);

authRouter.post("/signup", authController.signup);

// OTP Token Validator added as Middleware.
authRouter.post("/resetPassword", tokenValidator("OTP"), authController.resetPassword);
authRouter.post("/verifyUser", tokenValidator("OTP"), authController.verifyUser);

export default authRouter;
