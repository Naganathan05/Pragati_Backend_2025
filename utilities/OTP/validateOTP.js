import {
    setResponseOk,
    setResponseBadRequest,
    setResponseTimedOut,
    setResponseInternalError,
} from "../response.js";

/*
    responseCode = 400 -> Invalid OTP,
    responseCode = 408 -> OTP Expiry,
    responseCode = 500 -> Internal Server Error,
    responseCode = 200 -> OTP Validated.
*/

export const validateOTP = async function (userID, OTP, db) {
    try {
        const [otpRecord] = await db.query(
            `
            SELECT * FROM otpTable
            WHERE userID = ? AND otp = ?`,
            [userID, OTP],
        );

        if (otpRecord.length === 0) {
            return setResponseBadRequest("Invalid OTP");
        }

        const isExpired = await db.query(
            `   
            DELETE FROM otpTable  
            WHERE userID = ? AND otp = ? AND expiryTime > NOW()`,
            [userID, OTP],
        );

        if (isExpired[0].affectedRows === 0) {
            return setResponseTimedOut("OTP Expired. Retry !");
        }

        return setResponseOk("Valid OTP");
    } catch (error) {
        return setResponseInternalError(error);
    }
};
