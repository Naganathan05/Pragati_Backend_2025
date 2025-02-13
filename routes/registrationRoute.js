import { Router } from "express";
import registrationController from "../controller/registrationController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const registrationRouter = Router();

registrationRouter.post(
    "/event",
    tokenValidator("JWT"),
    registrationController.addRegistration,
);
registrationRouter.put(
    "/event/edit",
    tokenValidator("JWT"),
    registrationController.editRegistration,
);

export default registrationRouter;
