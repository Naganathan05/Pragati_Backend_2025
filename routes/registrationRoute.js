import { Router } from "express";
import registrationController from "../controller/registrationController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const registrationRouter = Router();

/**
 * @swagger
 * /api/registration/event:
 *   post:
 *     summary: Register for an event
 *     description: Registers a team for an event using a Bearer token.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Event Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventID
 *               - totalMembers
 *               - teamName
 *             properties:
 *               eventID:
 *                 type: integer
 *                 description: ID of the event to register for
 *               totalMembers:
 *                 type: integer
 *                 description: Total number of team members
 *               teamName:
 *                 type: string
 *                 description: Name of the team
 *               teamMembers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of team member Email ID's
 *               memberRoles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of roles for each team member
 *     responses:
 *       200:
 *         description: Successfully registered for the event
 *       400:
 *         description: Bad request due to missing or invalid fields
 *       401:
 *         description: Unauthorized, missing or invalid Bearer OTP Token
 *       500:
 *         description: Internal server error
 *
 * /api/registration/event/edit:
 *   put:
 *     summary: Edit event registration
 *     description: Updates event registration details using a Bearer token.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Event Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventID
 *               - teamName
 *             properties:
 *               eventID:
 *                 type: integer
 *                 description: ID of the event to edit
 *               teamName:
 *                 type: string
 *                 description: New name of the team
 *     responses:
 *       200:
 *         description: Successfully updated event registration
 *       400:
 *         description: Bad request due to missing or invalid fields
 *       401:
 *         description: Unauthorized, missing or invalid Bearer OTP Token
 *       500:
 *         description: Internal server error
 */

registrationRouter.post(
    "/event",
    tokenValidator("JWT"),
    registrationController.addRegistration,
);

registrationRouter.put(
    "/event/edit",
    tokenValidator("JWT"),
    registrationController.editRegistration,
);

export default registrationRouter;
