import {
    setResponseOk,
    setResponseTransactionFailed,
    setResponseBadRequest,
    setResponseInternalError,
    setResponseServiceFailure,
} from "../utilities/response.js";
import fetch from "node-fetch";
import { appConfig } from "../config/config.js";
import { generateVerifyHash } from "../utilities/payU.js";
import { appendFileSync } from "fs";

const { payUKey, payUVerifyURL } = appConfig;

let transactionResponse = null;

export const verifyTransaction = async function (
    txnID,
    pragatiDb,
    transactionsDb,
) {
    const db = await pragatiDb.promise().getConnection();
    const transactionDB = await transactionsDb.promise().getConnection();

    // console.log("[INFO]: Verify Transaction Controller Called");

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

        // console.log(
        //     "[INFO]: Transaction Verification Started for Transaction ID: ",
        //     txnID,
        // );

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

        if (responseData.status === 0) {
            return setResponseServiceFailure(
                "Payment Gateway Failed ! Try again later.",
            );
        }
        const transactionDetails = responseData.transaction_details[txnID];

        // console.log(
        //     "[INFO]: PayU Transaction Details for Transaction ID: ",
        //     txnID,
        // );
        // console.log(transactionDetails);

        await db.beginTransaction();
        await transactionDB.beginTransaction();

        transactionStarted = 1;

        if (transactionDetails.status === "success") {
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
        } else if (transactionDetails.status === "failure") {
            await transactionDB.query(
                "UPDATE transactionData SET transactionStatus = '0' WHERE txnID = ?",
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

            transactionResponse = setResponseTransactionFailed(
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
