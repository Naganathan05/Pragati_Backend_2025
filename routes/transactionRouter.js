import { Router } from "express";
import transactionController from "../controller/transactionController.js";

const transactionRouter = Router();

/**
 * @swagger
 * /api/transaction/verify:
 *   post:
 *     summary: Verify a transaction
 *     description: Validates a transaction against PayU and updates its status accordingly.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnID
 *             properties:
 *               txnID:
 *                 type: string
 *                 example: "TXN001"
 *                 description: The transaction ID to be verified.
 *     responses:
 *       200:
 *         description: Transaction verification status.
 *       400:
 *         description: Bad request, invalid transaction ID or failed transaction.
 *       500:
 *         description: Internal server error or verification failure.
 */
transactionRouter.post(
    "/verify",
    transactionController.verifyTransactionController,
);

export default transactionRouter;
