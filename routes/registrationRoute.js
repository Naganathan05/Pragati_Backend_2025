import { Router } from "express";
import registrationController from "../controller/registrationController.js"
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const registrationRouter = Router();

registrationRouter.post("/registerEvent", tokenValidator("JWT"), registrationController.addRegistration);
registrationRouter.post("/editRegistration", tokenValidator("JWT"), registrationController.editRegistration);

export default registrationRouter;