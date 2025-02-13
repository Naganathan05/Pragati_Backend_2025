import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import { verifyTransaction } from "../module/verifyTransaction.js";
import validateTransactionID from "../utilities/dataValidator/transaction.js";
import { pragatiDb, transactionsDb } from "../db/poolConnection.js";

const transactionController = {
    verifyTransactionController: async (req, res) => {
        const { txnID } = req.body;

        const db = await pragatiDb.promise().getConnection();
        const invalidTxnID = await validateTransactionID(txnID, db);
        if (invalidTxnID) {
            return setResponseBadRequest(invalidTxnID);
        }

        try {
            const moduleResponse = await verifyTransaction(
                txnID,
                pragatiDb,
                transactionsDb,
            );
            return res
                .status(moduleResponse.responseCode)
                .json(moduleResponse.responseBody);
        } catch (err) {
            console.log(
                "[ERROR]: Error in Verify Transaction Controller: ",
                err,
            );
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default transactionController;
