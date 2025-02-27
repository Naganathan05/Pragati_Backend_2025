import { Router } from "express";
import clubController from "../controller/clubController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const clubRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Clubs
 *   description: Club management endpoints
 */

/**
 * @swagger
 * /clubs:
 *   get:
 *     summary: Get all clubs
 *     description: Retrieve a list of all available clubs
 *     tags: [Clubs]
 *     responses:
 *       200:
 *         description: List of clubs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/routes/clubRoute'
 *       500:
 *         description: Server error
 */
clubRouter.get("/", clubController.getAllClubs);

/**
 * @swagger
 * /clubs:
 *   post:
 *     summary: Add a new club (Admin only)
 *     description: Create a new club entry
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/routes/clubRoute'
 *     responses:
 *       201:
 *         description: Club created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (invalid permissions)
 *       500:
 *         description: Server error
 */
clubRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    clubController.addClub
);

/**
 * @swagger
 * /clubs:
 *   put:
 *     summary: Update a club (Admin only)
 *     description: Modify existing club details
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/routes/clubRoute'
 *     responses:
 *       200:
 *         description: Club updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (invalid permissions)
 *       404:
 *         description: Club not found
 *       500:
 *         description: Server error
 */
clubRouter.put(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    clubController.editClub
);

/**
 * @swagger
 * /clubs:
 *   delete:
 *     summary: Delete a club (Admin only)
 *     description: Remove a club from the system
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clubId:
 *                 type: integer
 *                 example: 123
 *             required:
 *               - clubId
 *     responses:
 *       200:
 *         description: Club deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (invalid permissions)
 *       404:
 *         description: Club not found
 *       500:
 *         description: Server error
 */
clubRouter.delete(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    clubController.removeClub
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Club:
 *       type: object
 *       properties:
 *         clubId:
 *           type: integer
 *           readOnly: true
 *         name:
 *           type: string
 *           example: "Tech Club"
 *         description:
 *           type: string
 *           example: "Technology enthusiasts group"
 *         imageUrl:
 *           type: string
 *           format: uri
 *           example: "https://example.com/tech-club.jpg"
 *         clubhead:
 *           type: string
 *           format: string
 *         clubAbbrevation:
 *           type: string
 *           format: string
 *         godname:
 *           type: string
 *           format: string
 *           example: "Pegasus"
 *       required:
 *         - name
 *         - description
 */

export default clubRouter;