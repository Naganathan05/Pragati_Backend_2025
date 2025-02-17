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

/**
 * @swagger
 * /api/notification/:
 *   put:
 *     summary: Modify notification event.
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
 *                notificationID:
 *                  type: string
 *                  description: ID of notification to change
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
notificationRouter.put(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    notificationController.updateNotification,
);

/**
 * @swagger
 * /api/notification/:
 *   delete:
 *     summary: Delete a notification.
 *     description: Requires admin privileges to delete.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationID:
 *                 type: string
 *                 description: ID of the event to be deleted
 *     responses:
 *       200:
 *         description: Event deleted successfully.
 *       400:
 *         description: Invalid event ID.
 *       403:
 *         description: Unauthorized. Admin access required.
 *       500:
 *         description: Internal server error.
 */
notificationRouter.delete(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    notificationController.deleteNotification,
);

export default notificationRouter;
