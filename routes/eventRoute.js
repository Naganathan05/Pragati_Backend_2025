import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import loginSetter from "../middleware/auth/loginSetter.js";
import eventController from "../controller/eventController.js";

const eventRouter = Router();

eventRouter.post("/", tokenValidator("JWT"), eventController.addEvent);
eventRouter.get("/all", loginSetter, eventController.getAllEvents);
eventRouter.get(
    "/:eventID(\\d+)",
    loginSetter,
    eventController.getEventDetailsByID,
);
eventRouter.get(
    "/club/:clubID(\\d+)",
    loginSetter,
    eventController.getEventForClub,
);
eventRouter.get(
    "/user/:id(\\d+)",
    loginSetter,
    eventController.getEventsRegisteredByUser,
);

export default eventRouter;
