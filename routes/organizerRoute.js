import { Router } from "express";
import organizerController from "../controller/organizerController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const organizerRouter = Router();

// GET all organizers.

/**
 * @swagger
 * /api/organizer:
 *   get:
 *     summary: Get all organizers.
 *     description: Fetches the list of all organizers.
 *     tags:
 *       - Organizers
 *     responses:
 *       200:
 *         description: Organizers retrieved successfully
 *       500:
 *         description: A problem from our side :(.
 */

organizerRouter.get("/", organizerController.allOrganizers);

// PUT, DELETE, POST routes for organizers accessible only to admin.
// ADMIN only routes

/**
 * @swagger
 * /api/organizer:
 *   put:
 *     summary: Edit an existing organizer.
 *     description: Requires admin privileges to edit an organizer's details.
 *     tags:
 *       - Organizers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizerID:
 *                 type: integer
 *               organizerName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organizer updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: You are not authorized to access this.
 *       404:
 *         description: Organizer not found.
 *       500:
 *         description: A problem from our side :(
 */
organizerRouter.put(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    organizerController.editOrganizer,
);

/**
 * @swagger
 * /api/organizer:
 *   delete:
 *     summary: Delete an organizer.
 *     description: Requires admin privileges to delete an organizer.
 *     tags:
 *       - Organizers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizerID:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Organizer deleted successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: You are not authorized to access this.
 *       404:
 *         description: Organizer not found.
 *       500:
 *         description: A problem from our side :(
 */
organizerRouter.delete(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    organizerController.removeOrganizer,
);

/**
 * @swagger
 * /api/organizer:
 *   post:
 *     summary: Add a new organizer.
 *     description: Requires admin privileges to add an organizer.
 *     tags:
 *       - Organizers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizerName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organizer inserted successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: You are not authorized to access this.
 *       500:
 *         description: A problem from our side :(
 */

organizerRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    organizerController.addOrganizer,
);

export default organizerRouter;
