import { Router } from "express";
import authRouter from "./authRoute.js";
import registrationRouter from "./registrationRoute.js";

const router = Router();

router.use('/auth',authRouter);
router.use('/event', registrationRouter);

export default router;