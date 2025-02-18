import { Router } from "express";
import profileController from "../controller/profileController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const profileRouter = Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile details.
 *     description: Fetches the profile information of a user by their user ID. Requires authentication.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched user profile.
 *       400:
 *         description: Invalid user ID.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: User profile not found.
 *       500:
 *         description: Internal server error.
 */
profileRouter.get("/", tokenValidator("JWT"), profileController.getUserProfile);

/**
 * @swagger
 * /api/profile/edit:
 *   put:
 *     summary: Edit user profile details.
 *     description: Updates the profile information of a user. Requires authentication.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: Unique identifier of the user.
 *               userName:
 *                 type: string
 *                 description: Name of the user.
 *               rollNumber:
 *                 type: string
 *                 description: Roll number of the user.
 *               phoneNumber:
 *                 type: string
 *                 description: Contact phone number.
 *               collegeName:
 *                 type: string
 *                 description: Name of the college.
 *               collegeCity:
 *                 type: string
 *                 description: City where the college is located.
 *               userDepartment:
 *                 type: string
 *                 description: Department of study.
 *               academicYear:
 *                 type: number
 *                 description: Academic year of the user.
 *               degree:
 *                 type: string
 *                 description: Degree pursued by the user.
 *               needAccommodationDay1:
 *                 type: boolean
 *                 description: Whether accommodation is needed for Day 1.
 *               needAccommodationDay2:
 *                 type: boolean
 *                 description: Whether accommodation is needed for Day 2.
 *               needAccommodationDay3:
 *                 type: boolean
 *                 description: Whether accommodation is needed for Day 3.
 *               isAmrita:
 *                 type: boolean
 *                 description: Whether the user is from Amrita University.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
profileRouter.put(
    "/edit",
    tokenValidator("JWT"),
    profileController.editProfile,
);

export default profileRouter;
