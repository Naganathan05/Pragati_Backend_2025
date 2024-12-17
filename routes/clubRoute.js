import { Router } from "express";
import clubController from "../controller/clubController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const clubRouter = Router();

// Apply tokenValidator to all routes
clubRouter.use(tokenValidator("JWT"));

// Routes
clubRouter.get("/", clubController.getAllClubs); // GET: Fetch all clubs
clubRouter.post("/", clubController.addClub);    // POST: Add a new club
clubRouter.put("/", clubController.editClub);    // PUT: Edit an existing club
clubRouter.delete("/:clubID(\\d+)", clubController.removeClub); // DELETE: Remove a club

export default clubRouter;
