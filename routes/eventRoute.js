import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator";
import eventController from "../controller/eventController";

const eventRouter = Router();
eventRouter.use(tokenValidator);

eventRouter.post("/", eventController.addEvent);

export default eventRouter;
