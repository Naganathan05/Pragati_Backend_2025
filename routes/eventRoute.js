import { Router } from "express";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import loginSetter from "../middleware/auth/loginSetter.js";
import eventController from "../controller/eventController.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const eventRouter = Router();

/**
 * @swagger
 * /api/event:
 *   post:
 *     summary: Add new event via this route.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               eventFee:
 *                 type: number
 *               eventDescription:
 *                 type: string
 *               eventDescSmall:
 *                 type: string
 *               isGroup:
 *                 type: boolean
 *               maxTeamSize:
 *                 type: number
 *               minTeamSize:
 *                 type: number
 *               eventDate:
 *                 type: string
 *               maxRegistrations:
 *                 type: number
 *               isPerHeadFee:
 *                 type: boolean
 *               godName:
 *                 type: string
 *               organizerIDs:
 *                 type: array
 *                 items:
 *                   type: number
 *               tagIDs:
 *                 type: array
 *                 items:
 *                   type: number
 *               clubID:
 *                 type: number
 *     responses:
 *       200:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input provided
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: A problem from our side :(
 */
eventRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    eventController.addEvent,
);

/**
 * @swagger
 * /api/event/all:
 *   get:
 *     summary: Get all events present.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fetched all events successfully
 *       500:
 *         description: A problem from our side :(
 */
eventRouter.get("/all", loginSetter, eventController.getAllEvents);

/**
 * @swagger
 * /api/event/{eventID}:
 *   get:
 *     summary: Get details of a specific event by its ID.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventID
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the event to fetch details for
 *     responses:
 *       200:
 *         description: Event details fetched successfully
 *       400:
 *         description: Invalid event ID
 *       404:
 *         description: Event not found
 *       500:
 *         description: A problem from our side :(
 */
eventRouter.get(
    "/:eventID(\\d+)",
    loginSetter,
    eventController.getEventDetailsByID,
);

/**
 * @swagger
 * /api/event/club/{clubID}:
 *   get:
 *     summary: Get all events for a specific club by its ID.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubID
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the club to fetch events for
 *     responses:
 *       200:
 *         description: Events for the club fetched successfully
 *       400:
 *         description: Invalid club ID
 *       404:
 *         description: Club not found
 *       500:
 *         description: A problem from our side :(
 */
eventRouter.get(
    "/club/:clubID(\\d+)",
    loginSetter,
    eventController.getEventForClub,
);

/**
 * @swagger
 * /api/event/user/{id}:
 *   get:
 *     summary: Get events registered by a specific user by their ID.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to fetch registered events for
 *     responses:
 *       200:
 *         description: Events registered by the user fetched successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: A problem from our side :(
 */
eventRouter.get(
    "/user/:id(\\d+)",
    loginSetter,
    eventController.getEventsRegisteredByUser,
);

/**
 * @swagger
 * /api/event/:
 *   put:
 *     summary: Edit details of an existing event.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventID:
 *                 type: integer
 *                 description: ID of the event to edit
 *               eventName:
 *                 type: string
 *                 description: Name of the event
 *               imageUrl:
 *                 type: string
 *                 description: URL of the event image
 *               eventFee:
 *                 type: number
 *                 description: Fee for the event
 *               eventDescription:
 *                 type: string
 *                 description: Full description of the event
 *               eventDescSmall:
 *                 type: string
 *                 description: Short description of the event
 *               isGroup:
 *                 type: boolean
 *                 description: Indicates if the event is group-based
 *               maxTeamSize:
 *                 type: number
 *                 description: Maximum team size allowed for the event
 *               minTeamSize:
 *                 type: number
 *                 description: Minimum team size allowed for the event
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the event
 *               maxRegistrations:
 *                 type: number
 *                 description: Maximum number of registrations allowed
 *               isPerHeadFee:
 *                 type: boolean
 *                 description: Indicates if the fee is per participant
 *               godName:
 *                 type: string
 *                 description: Name of the god associated with the event
 *               organizerIDs:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of organizer IDs
 *               tagIDs:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of tag IDs
 *               clubID:
 *                 type: integer
 *                 description: ID of the club organizing the event
 *     responses:
 *       200:
 *         description: Event edited successfully
 *       400:
 *         description: Invalid request body or event ID
 *       403:
 *         description: Unauthorized (user does not have the required role)
 *       404:
 *         description: Event not found
 *       500:
 *         description: A problem from our side :(
 */
eventRouter.put(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    eventController.editEvent,
);

/**
 * @swagger
 * /api/event/toggleStatus:
 *   put:
 *     summary: Toggle the status of a specific event (Open/Close [0/1]).
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventID:
 *                 type: integer
 *                 description: ID of the event whose status needs to be toggled
 *     responses:
 *       200:
 *         description: Event status toggled successfully
 *       400:
 *         description: Invalid event ID
 *       403:
 *         description: Unauthorized (user does not have the required role)
 *       500:
 *         description: A problem from our side :(
 */
eventRouter.put(
    "/toggleStatus",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    eventController.toggleStatus,
);


eventRouter.delete("/", tokenValidator("JWT"), authorizeRoles([1]), eventController.deleteEvent);

export default eventRouter;
