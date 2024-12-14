import { Router } from "express";
import authRouter from "./authRoute.js";
import organizerRouter from "./organizerRoute.js";
import registrationRouter from "./registrationRoute.js";

const router = Router();

router.use('/auth',authRouter);
router.use('/org',organizerRouter)
router.use('/event', registrationRouter);

export default router;