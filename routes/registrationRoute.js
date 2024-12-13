import { Router } from "express";
import registrationController from "../controller/registrationController.js"
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const registrationRouter = Router();

registrationRouter.post("/registerEvent", tokenValidator, registrationController.addRegistration);

export default registrationRouter;