import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import eventController from "../controller/eventController.js";

const eventRouter = Router();

eventRouter.post("/", tokenValidator("JWT"), eventController.addEvent);
eventRouter.get("/all", eventController.getAllEvents);
eventRouter.get("/:eventID(\\d+)", eventController.getEventDetailsByID);
eventRouter.get("/club/:clubID(\\d+)", eventController.getEventForClub);


export default eventRouter;
