import {
    setResponseOk,
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import { pragatiDb } from "../db/poolConnection.js";
import { checkValidUser } from "../utilities/dbUtilities/userUtilities.js";

const editRegistrationModule = {
    editRegistration: async function (userID, eventID, teamName) {
        const db = await pragatiDb.promise().getConnection();
        try {
            const userDataResponse = await checkValidUser(
                null,
                db,
                "userID",
                userID,
            );
            if (userDataResponse.responseCode !== 200) {
                return setResponseBadRequest(userDataResponse.responseBody);
            }

            await db.query("LOCK TABLES registrationData WRITE");
            const [registrationUpdate] = await db.query(
                "UPDATE registrationData SET teamName = ? WHERE userID = ? AND eventID = ? AND registrationStatus = ?",
                [teamName, userID, eventID, "2"],
            );

            /*
            If the Update has not happened, possible cases:
                1] User is not Team Leader so that userID wont Match.
                2] registrationStatus is still Pending.
            */
            if (registrationUpdate.affectedRows === 0) {
                return setResponseBadRequest(
                    "Failed to Update Team Name. Either You are not the Team Leader or your registration status is pending, verify your payment before attempting.",
                );
            }

            await db.query("UNLOCK TABLES");
            return setResponseOk("Team Name Updated Succussfully.");
        } catch (error) {
            console.log("[ERROR]: Error in Edit Registration Module: ", error);
            logError(err, "editRegistrationModule : Edit Registration", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
};

export { editRegistrationModule };
