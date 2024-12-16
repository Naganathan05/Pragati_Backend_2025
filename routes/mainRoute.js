import { Router } from "express";
import authRouter from "./authRoute.js";
import eventRouter from "./eventRoute.js";
import organizerRouter from "./organizerRoute.js";
import registrationRouter from "./registrationRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/event", eventRouter);
router.use('/org',organizerRouter)
router.use('/registration', registrationRouter);

export default router;
