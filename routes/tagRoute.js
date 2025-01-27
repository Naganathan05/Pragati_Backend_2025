import { Router } from "express";
import tagController from "../controller/tagController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const tagRouter = Router();

tagRouter.post("/", tokenValidator("JWT"), tagController.addTag); // POST: Create a new tag
tagRouter.get("/", tagController.getAllTags); // GET: Retrieve all tags
tagRouter.put("/", tokenValidator("JWT"), tagController.editTag); // PUT: Update a tag
tagRouter.delete("/", tokenValidator("JWT"), tagController.removeTag); // DELETE: Delete a tag

export default tagRouter;
