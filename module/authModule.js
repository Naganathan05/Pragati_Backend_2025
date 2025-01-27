import crypto from "crypto";
import {
    setResponseOk,
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { createToken } from "../middleware/tokenGenerator.js";
import { validateOTP } from "../utilities/OTP/validateOTP.js";
import { generateOTP } from "../utilities/OTP/otpGenerator.js";
import { isUserExistsByEmail } from "../utilities/dbUtilities/common.js";
import { checkValidUser } from "../utilities/dbUtilities/userUtilities.js";
import {
    sendForgotPasswordOtp,
    sendRegistrationOTP,
} from "../utilities/mailer/mailer.js";
import { pragatiDb } from "../db/poolConnection.js";

const authModule = {
    login: async function (email, password) {
        const db = await pragatiDb.promise().getConnection();
        try {
            // response will be sent in default response format
            const response = await checkValidUser(email, db, "userEmail", null);
            if (response.responseCode !== 200) {
                return response;
            }
            const userData = response.responseData;

            if (userData[0].userPassword != password) {
                return setResponseBadRequest(
                    "Incorrect password for given user..",
                );
            }

            const token = createToken(
                {
                    userID: userData[0].userID,
                    userEmail: userData[0].userEmail,
                    roleID: userData[0].roleID,
                },
                "User",
            );

            return setResponseOk("Login successful", {
                roleID: userData[0].roleID,
                TOKEN: token,
            });
        } catch (err) {
            console.log("[ERROR]: Error in Login Module: ", err);
            logError(err, "authModule:login", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },

    signup: async function (userData) {
        const {
            userEmail,
            userPassword,
            userName,
            rollNumber,
            phoneNumber,
            collegeName,
            collegeCity,
            userDepartment,
            academicYear,
            degree,
            isAmrita,
        } = userData;

        const db = await pragatiDb.promise().getConnection();

        try {
            var transactionStarted = 0;
            const emailExist = await isUserExistsByEmail(userEmail, db);
            if (emailExist != null) {
                return setResponseBadRequest("User Email already exists!!");
            }

            /*
      Started a transaction to ensure atomical writes to userData Table and otpTable.
      If any one of the write resulted in error, DB will be rolled back to the start of transaction
      which avoids any partial change to the DB.
      */

            await db.beginTransaction();

            const query = `
        INSERT INTO userData 
          (userEmail, userPassword, userName, rollNumber, phoneNumber, collegeName, collegeCity, userDepartment, academicYear, degree, isAmrita)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

            const values = [
                userEmail,
                userPassword,
                userName,
                rollNumber,
                phoneNumber,
                collegeName,
                collegeCity,
                userDepartment,
                academicYear,
                degree,
                isAmrita,
            ];

            // Denotes that server entered the Transaction -> Needs rollback incase of error.
            transactionStarted = 1;

            // Insert record into userData.
            await db.query("LOCK TABLES userData WRITE");
            const [userData] = await db.query(query, values);

            const OTP = generateOTP();
            const otpToken = createToken(
                {
                    userID: userData.insertId,
                },
                "OTP",
            );

            const otpHashed = crypto
                .createHash("sha256")
                .update(OTP)
                .digest("hex");

            // Mailer Module called to send Registration Verification OTP.
            await sendRegistrationOTP(userName, OTP, userEmail);

            // Insert OTP value into otpTable.
            await db.query("LOCK TABLES otpTable WRITE;");
            await db.query(
                `
        INSERT INTO otpTable (userID, otp, expiryTime) 
        VALUES (?, ?, CURRENT_TIMESTAMP + INTERVAL 5 MINUTE)`,
                [userData.insertId, otpHashed],
            );

            // Commit Transaction and return response.
            await db.commit();
            return setResponseOk("Sign up successful", otpToken);
        } catch (err) {
            console.log("[ERROR]: Error in SignUp Module: ", err);
            if (transactionStarted === 1) {
                await db.rollback();
            }

            logError(err, "authModule:signup", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },

    verifyUser: async function (userID, OTP) {
        const db = await pragatiDb.promise().getConnection();
        try {
            var transactionStarted = 0;
            const response = await checkValidUser(null, db, "userID", userID);
            if (response.responseCode === 401) {
                return setResponseBadRequest(response.responseBody);
            }

            /*
      Started a transaction to ensure atomical writes to otpTable and userData Table.
      If any one of the write resulted in error, DB will be rolled back to the start of transaction
      which avoids any partial change to the DB.
      */

            await db.beginTransaction();
            await db.query("LOCK TABLES otpTable WRITE;");

            // Denotes that server entered the Transaction -> Needs Rollback incase of error.
            transactionStarted = 1;

            // Utility function validateOTP called for validating the OTP entered by the User.
            const validateOTPResponse = await validateOTP(userID, OTP, db);

            // validateOTP has catched a internal server error in its execution.
            if (validateOTPResponse.responseCode === 500) {
                // No need to check for the flag "transactionStarted", since it will be definitely started in this step of execution.
                await db.rollback();

                console.log(
                    "[ERROR]: Error in Verify Account Module",
                    validateOTPResponse.responseBody.DATA,
                );
                logError(
                    validateOTPResponse.responseBody.DATA,
                    "authModule:Verify Account",
                    "db",
                );
                return setResponseInternalError();
            }

            // validateOTP has resulted in invalid OTP or expired OTP.
            if (validateOTPResponse.responseCode !== 200) {
                return validateOTPResponse;
            }

            // Updated the accountStatus field to ['2' - Active] for the user.
            await db.query("LOCK TABLES userData WRITE;");
            await db.query(
                "UPDATE userData SET accountStatus = ? WHERE userID = ?",
                ["2", userID],
            );
            return setResponseOk("Account Verified Succussfully");
        } catch (error) {
            // Transaction  Rolledback only if there is error and the server has entered the Transaction.
            if (transactionStarted === 1) {
                await db.rollback();
            }

            console.log("[ERROR]: Error in Verify Account Module", error);
            logError(err, "authModule:Verify Account", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },

    forgotPassword: async function (userEmail) {
        const db = await pragatiDb.promise().getConnection();
        try {
            var transactionStarted = 0;
            const response = await checkValidUser(
                userEmail,
                db,
                "userEmail",
                null,
            );
            if (response.responseCode !== 200) {
                return setResponseBadRequest(response.responseBody);
            }

            const userData = response.responseData;

            /*
      Started a transaction to ensure atomical writes to otpTable.
      If any one of the write resulted in error, DB will be rolled back to the start of transaction
      which avoids any partial change to the DB.
      */

            await db.beginTransaction();
            await db.query("LOCK TABLE otpTable WRITE");

            // Denotes that server entered the Transaction -> Needs rollback incase of error.
            transactionStarted = 1;

            const OTP = generateOTP();
            const otpToken = createToken(
                {
                    userID: userData[0].userID,
                },
                "OTP",
            );

            // Mailer Service called to send Forgot Password OTP.
            await sendForgotPasswordOtp(userData[0].userName, OTP, userEmail);

            // Delete old OTP value for the user from otpTable.
            await db.query("DELETE FROM otpTable WHERE userID = ?", [
                userData[0].userID,
            ]);

            const otpHashed = crypto
                .createHash("sha256")
                .update(OTP)
                .digest("hex");

            // Insert new OTP value for the User into otpTable.
            await db.query(
                `
        INSERT INTO otpTable (userID, otp, expiryTime) 
        VALUES (?, ?, CURRENT_TIMESTAMP + INTERVAL 5 MINUTE)`,
                [userData[0].userID, otpHashed],
            );

            // Transaction Committed.
            await db.commit();
            return setResponseOk("Check Email for Password Reset OTP", {
                TOKEN: otpToken,
            });
        } catch (error) {
            // Transaction  Rolledback only if there is error and the server has entered the Transaction.
            if (transactionStarted === 1) {
                await db.rollback();
            }

            console.log("[ERROR]: Error in Forgot Password Module: ", error);
            logError(err, "authModule:Forgot Password", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },

    resetPassword: async function (userID, OTP, newPassword) {
        const db = await pragatiDb.promise().getConnection();
        try {
            var transactionStarted = 0;
            const response = await checkValidUser(null, db, "userID", userID);
            if (response.responseCode !== 200) {
                return setResponseBadRequest(response.responseBody);
            }

            /*
      Started a transaction to ensure atomical writes to otpTable and userData Table.
      If any one of the write resulted in error, DB will be rolled back to the start of transaction
      which avoids any partial change to the DB.
      */

            await db.beginTransaction();
            await db.query("LOCK TABLES otpTable WRITE;");

            // Denotes that server entered the Transaction -> Needs Rollback incase of error.
            transactionStarted = 1;

            // Utility function validateOTP called for validating the OTP entered by the User.
            const validateOTPResponse = await validateOTP(userID, OTP, db);

            // validateOTP has catched a internal server error in its execution.
            if (validateOTPResponse.responseCode === 500) {
                // No need to check for the flag "transactionStarted", since it will be definitely started in this step of execution.
                await db.rollback();

                console.log(
                    "[ERROR]: Error in Reset Password Module",
                    validateOTPResponse.responseBody.DATA,
                );
                logError(
                    validateOTPResponse.responseBody.DATA,
                    "authModule:Reset Password",
                    "db",
                );
                return setResponseInternalError();
            }

            // validateOTP has resulted in either invalid OTP or expired OTP.
            if (validateOTPResponse.responseCode != 200) {
                return validateOTPResponse;
            }

            // Updated the password field to new value for the user.
            await db.query("LOCK TABLES userData WRITE;");
            await db.query(
                "UPDATE userData SET userPassword = ? WHERE userID = ?",
                [newPassword, userID],
            );
            return setResponseOk("Password Reset Succussful");
        } catch (error) {
            // Transaction  Rolledback only if there is error and the server has entered the Transaction.
            if (transactionStarted === 1) {
                await db.rollback();
            }

            console.log("[ERROR]: Error in Reset Password Module", error);
            logError(err, "authModule:Reset Password", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
};

export default authModule;
