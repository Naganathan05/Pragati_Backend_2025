import { Router } from "express";
import organizerController from "../controller/organizerController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const organizerRouter = Router();
organizerRouter.use(tokenValidator);

organizerRouter.put("/", organizerController.editOrganizer);
organizerRouter.delete("/",organizerController.removeOrganizer);
organizerRouter.post("/",organizerController.addOrganizer);
organizerRouter.get("/",organizerController.getAllOrganizer);

export default organizerRouter;
