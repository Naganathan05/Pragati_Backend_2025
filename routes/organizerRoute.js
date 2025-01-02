import { Router } from "express";
import organizerController from "../controller/organizerController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const organizerRouter = Router();
organizerRouter.use(tokenValidator);

organizerRouter.put("/editOrganizer", organizerController.editOrganizer);
organizerRouter.delete("/removeOrganizer",organizerController.removeOrganizer);
organizerRouter.post("/addOrganizer",organizerController.addOrganizer);

export default organizerRouter