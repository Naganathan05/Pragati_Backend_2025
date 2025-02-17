import { Router } from "express";
import massMailerController from "../controller/massMailerController.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const massMailerRouter = Router();
massMailerRouter.use(tokenValidator("JWT"), authorizeRoles([1]));

massMailerRouter.post(
    "/allParticipant",
    massMailerController.allParticipantMailer,
);

massMailerRouter.post(
    "/eventParticipant",
    massMailerController.eventParticipantMailer,
);

massMailerRouter.post(
    "/selectedParticipant",
    massMailerController.selectedParticipantMailer,
);

export default massMailerRouter;
