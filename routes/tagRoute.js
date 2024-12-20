import { Router } from "express";
import tagController from "../controller/tagController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const tagRouter = Router();

tagRouter.post("/add", tagController.addTag);
tagRouter.get("/", tagController.getAllTags);
tagRouter.delete("/remove", tagController.removeTag); 
tagRouter.put("/edit", tagController.editTag);       

export default tagRouter;