import { Router } from "express";
import adminController from "../controller/adminController.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const adminRouter = Router();

adminRouter.use(tokenValidator("JWT"), authorizeRoles([1]));

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Retrieve all transactions.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *       500:
 *         description: A problem from our side :(
 */
adminRouter.get("/transactions", adminController.getAllTransactions);

/**
 * @swagger
 * /api/admin/roles:
 *   get:
 *     summary: Retrieve all roles.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *       500:
 *         description: A problem from our side :(
 */
adminRouter.get("/roles", adminController.getAllRoles);

/**
 * @swagger
 * /api/admin/amountGenerated:
 *   get:
 *     summary: Retrieve event-wise amount generated.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Amount retrieved successfully
 *       500:
 *         description: A problem from our side :(
 */
adminRouter.get(
    "/amountGenerated",
    adminController.getEventWiseAmountGenerated,
);

/**
 * @swagger
 * /api/admin/changeUserStatus:
 *   put:
 *     summary: Change the status of a user.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentID:
 *                 type: integer
 *                 description: ID of the student
 *               accountStatus:
 *                 type: integer
 *                 description: New account status (0, 1, or 2)
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: A problem from our side :(
 */
adminRouter.put("/changeUserStatus", adminController.changeStatusOfUser);

/**
 * @swagger
 * /api/admin/changeUserRole:
 *   put:
 *     summary: Change the role of a user.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentID:
 *                 type: integer
 *                 description: ID of the student
 *               userRoleID:
 *                 type: integer
 *                 description: New role ID
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: A problem from our side :(
 */
adminRouter.put("/changeUserRole", adminController.changeUserRole);

/**
 * @swagger
 * /api/admin/addUserRole:
 *   post:
 *     summary: Add a new user role.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userRoleID:
 *                 type: integer
 *                 description: Role ID
 *               roleName:
 *                 type: string
 *                 description: Name of the role
 *     responses:
 *       200:
 *         description: Role added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
adminRouter.post("/addUserRole", adminController.addNewUserRole);

export default adminRouter;
