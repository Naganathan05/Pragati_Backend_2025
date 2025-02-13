import notificationController from "../controller/notificationController.js";
import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const notificationRouter = Router();

/**
 * @swagger
 * /api/notification/:
 *   get:
 *     summary: Get all current notifications
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: Fetched all notifications successfully
 *       404:
 *         description: No notification found.
 *       500:
 *         description: A problem from our side :(
 */
notificationRouter.get("/", notificationController.getAllNotifications);

/**
 * @swagger
 * /api/notification/:
 *   post:
 *     summary: Add a notification event.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Title of the notification
 *                description:
 *                  type: string
 *                  description: Description of the event notification
 *                author:
 *                  type: string
 *                  description: Entity who issues the notification
 *                venue:
 *                  type: string
 *                  description: Venue of the event occuring
 *                startDate:
 *                  type: date
 *                  description: Start date of the event.
 *                endDate:
 *                  type: date
 *                  description: End date of the event.
 *     responses:
 *       200:
 *         description: Fetched all events successfully
 *       400:
 *         description: Incorrect request body
 *       500:
 *         description: A problem from our side :(
 */
notificationRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    notificationController.addNotification,
);

export default notificationRouter;
