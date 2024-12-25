import { Router } from 'express';
import adminController from "../controller/adminController.js";
import authorizeRoles from '../middleware/auth/authRoleValidator.js';
import { tokenValidator } from '../middleware/auth/tokenValidator.js';

const adminRouter = Router();

adminRouter.use(tokenValidator("JWT"),authorizeRoles([1]))
adminRouter.get("/transactions", adminController.getAllTransactions);
adminRouter.get("/roles", adminController.getAllRoles);
adminRouter.get("/amountGenerated", adminController.getEventWiseAmountGenerated);
export default adminRouter;
