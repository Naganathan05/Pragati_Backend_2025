import { Router } from "express";
import clubController from "../controller/clubController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const clubRouter = Router();

// Routes
clubRouter.get("/", clubController.getAllClubs); // GET: Fetch all clubs (No token validation required)

// Apply tokenValidator only for protected routes
clubRouter.post("/", tokenValidator("JWT"), clubController.addClub); // POST: Add a new club
clubRouter.put("/", tokenValidator("JWT"), clubController.editClub); // PUT: Edit an existing club
clubRouter.delete("/", tokenValidator("JWT"), clubController.removeClub); // DELETE: Remove a club

export default clubRouter;
