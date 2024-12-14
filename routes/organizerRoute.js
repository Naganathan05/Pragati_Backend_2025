import { Router } from "express";
import organizerController from "../controller/organizerController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const organizerRouter = Router();
organizerRouter.use(tokenValidator);

//Still controllers have to be written, so for now I'm just linking it...
organizerRouter.put("/editOrganizer", organizerController.editOrganizer);
organizerRouter.delete("/removeOrganizer",organizerController.removeOrganizer);
organizerRouter.post("/addOrganizer",organizerController.addOrganizer);

export default organizerRouter