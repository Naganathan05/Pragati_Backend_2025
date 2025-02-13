import { Router } from "express";
import tagController from "../controller/tagController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const tagRouter = Router();

/**
 * @swagger
 * /api/tag:
 *   get:
 *     summary: Retrieve all tags.
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tags retrieved successfully
 *       500:
 *         description: A problem from our side :(
 */
tagRouter.get("/", tagController.getAllTags); // GET: Retrieve all tags

// Admin only.

/**
 * @swagger
 * /api/tag:
 *   post:
 *     summary: Create a new tag.
 *     description: Requires admin privileges to add a tag.
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagName:
 *                 type: string
 *                 description: Name of the tag
 *               tagAbbrevation:
 *                 type: string
 *                 description: Abbreviation of the tag
 *     responses:
 *       200:
 *         description: Tag created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (admin privileges required)
 *       500:
 *         description: A problem from our side :(
 */
tagRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    tagController.addTag,
); // POST: Create a new tag

/**
 * @swagger
 * /api/tag:
 *   put:
 *     summary: Update an existing tag.
 *     description: Requires admin privileges to edit a tag.
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagID:
 *                 type: integer
 *                 description: ID of the tag to edit
 *               tagName:
 *                 type: string
 *                 description: New name for the tag
 *               tagAbbrevation:
 *                 type: string
 *                 description: New abbreviation for the tag
 *     responses:
 *       200:
 *         description: Tag updated successfully.
 *       400:
 *         description: Invalid input or tag ID.
 *       403:
 *         description: Unauthorized (admin privileges required).
 *       404:
 *         description: Tag not found.
 *       500:
 *         description: A problem from our side :(
 */
tagRouter.put(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    tagController.editTag,
); // PUT: Update a tag

/**
 * @swagger
 * /api/tag:
 *   delete:
 *     summary: Delete a tag.
 *     description: Requires admin privileges to delete a tag.
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagID:
 *                 type: integer
 *                 description: ID of the tag to delete
 *     responses:
 *       200:
 *         description: Tag deleted successfully.
 *       400:
 *         description: Invalid tag ID.
 *       403:
 *         description: Unauthorized (admin privileges required).
 *       404:
 *         description: Tag not found.
 *       500:
 *         description: A problem from our side :(
 */
tagRouter.delete(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    tagController.removeTag,
); // DELETE: Delete a tag

export default tagRouter;
