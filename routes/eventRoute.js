import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import eventController from "../controller/eventController.js";

const eventRouter = Router();
eventRouter.use(tokenValidator);

eventRouter.post("/", eventController.addEvent);

export default eventRouter;
