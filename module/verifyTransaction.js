import {
    setResponseOk,
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import fetch from "node-fetch";
import { appConfig } from "../config/config.js";
import { generateVerifyHash } from "../utilities/payU.js";

const { payUKey, payUVerifyURL } = appConfig;

let transactionResponse = null;

export const verifyTransaction = async function (
    txnID,
    pragatiDb,
    transactionsDb,
) {
    const db = await pragatiDb.promise().getConnection();
    const transactionDB = await transactionsDb.promise().getConnection();

    try {
        var transactionStarted = 0;

        await transactionDB.query("LOCK TABLES transactionData READ");

        const [transactionData] = await transactionDB.query(
            "SELECT * FROM transactionData WHERE txnID = ?",
            [txnID],
        );

        await transactionDB.query("UNLOCK TABLES");

        if (transactionData.length === 0) {
            return setResponseBadRequest(
                "No Transaction Exists for the given Transaction ID !",
            );
        }

        if (transactionData[0].transactionStatus !== "1") {
            return setResponseOk(
                "Transaction Verification Done.",
                transactionData[0].transactionStatus,
            );
        }

        const hash = generateVerifyHash({
            command: "verify_payment",
            var1: txnID,
        });

        const response = await fetch(payUVerifyURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `key=${payUKey}&command=verify_payment&hash=${hash}&var1=${txnID}`,
        });

        const responseData = await response.json();

        const transactionDetails = responseData.transaction_details[txnID];

        await db.beginTransaction();
        await transactionDB.beginTransaction();

        transactionStarted = 1;

        if (transactionDetails[0].status === "success") {
            await transactionDB.query(
                "UPDATE transactionData SET transactionStatus = '2' WHERE txnID = ?",
                [txnID],
            );

            await db.query(
                "UPDATE registrationData SET registrationStatus = '2' WHERE txnID = ?",
                [txnID],
            );

            transactionResponse = setResponseOk(
                "Transaction Verified Succussfully",
            );
        } else if (transactionDetails[0].status === "failed") {
            await transactionDB.query(
                "UPDATE transactionData SET transactionStatus = '1' WHERE txnID = ?",
                [txnID],
            );

            const [releaseSeats] = await db.query(
                "SELECT registrationID, eventID, totalMembers FROM registrationData WHERE txnID = ?",
                [txnID],
            );

            if (releaseSeats.length > 0) {
                await db.query(
                    "DELETE FROM groupDetail WHERE registrationID = ?",
                    [releaseSeats[0].registrationID],
                );

                await db.query("DELETE FROM registrationData WHERE txnID = ?", [
                    txnID,
                ]);

                await db.query(
                    `UPDATE eventData SET numRegistrations = numRegistrations - ? WHERE eventID = ?`,
                    [releaseSeats[0].totalMembers, releaseSeats[0].eventID],
                );
            }

            transactionResponse = setResponseBadRequest(
                "Transaction Failed !!",
            );
        } else {
            transactionResponse = setResponseInternalError(
                "Unable to Verify Transaction !!",
            );
        }

        await transactionDB.commit();
        await db.commit();
        return transactionResponse;
    } catch (err) {
        if (transactionStarted === 1) {
            await db.rollback();
            await transactionDB.rollback();
        }

        console.log("[ERROR]: Error in Verify Transaction Module: ", err);
        appendFileSync(
            "./logs/controller/controllerErrors.log",
            `${new Date().getTime()}-"Verify Transaction Module Failed"-${err}`,
        );
        return setResponseInternalError(err);
    } finally {
        await db.query("UNLOCK TABLES");
        await transactionDB.query("UNLOCK TABLES");

        db.release();
        transactionDB.release();
    }
};
