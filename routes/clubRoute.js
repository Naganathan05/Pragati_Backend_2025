import { Router } from "express";
import clubController from "../controller/clubController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const clubRouter = Router();

// Routes
clubRouter.get("/", clubController.getAllClubs); // GET: Fetch all clubs (No token validation required)

// Apply tokenValidator only for protected routes
clubRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    clubController.addClub,
); // POST: Add a new club
clubRouter.put(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    clubController.editClub,
); // PUT: Edit an existing club
clubRouter.delete(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    clubController.removeClub,
); // DELETE: Remove a club

export default clubRouter;
