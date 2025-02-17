import { appendFileSync } from "fs";
import { pragatiDb } from "../db/poolConnection.js";
import {
    sendAnnouncementMail,
    sendEventMail,
} from "../utilities/mailer/mailer.js";
import {
    setResponseOk,
    setResponseInternalError,
    setResponseBadRequest,
} from "../utilities/response.js";

const massMailerModule = {
    allParticipantsMailer: async function (ccEmails, announcement) {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES userData READ");
            const [userData] = await db.query(
                "SELECT * FROM userData WHERE roleID = 2",
            );

            const userEmails = userData.map((user) => user.userEmail);

            await sendAnnouncementMail(userEmails, ccEmails, announcement);
            return setResponseOk("Announcement Mail Sent Succussfully !");
        } catch (err) {
            console.log("[ERROR]: Error in Mass Mailer Module: ", err);
            appendFileSync(
                "./logs/controller/controllerErrors.log",
                `${new Date().getTime}-"Mass Mailer Module Failed"-${err}`,
            );
            return setResponseInternalError(err);
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },

    eventParticipantsMailer: async function (eventID, ccEmails, announcement) {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query(
                "LOCK TABLES eventData READ, groupDetail READ, registrationData READ, userData READ",
            );

            const [eventData] = await db.query(
                "SELECT eventName FROM eventData WHERE eventID = ?",
                [eventID],
            );

            if (eventData.length === 0) {
                return setResponseBadRequest(
                    "Event Doesn't Exist for given Event ID !!",
                );
            }

            // Select userID's that registered for the event and registration status is Verified.
            const [eventRegisteredUsers] = await db.query(
                `SELECT groupDetail.userID FROM groupDetail 
                JOIN registrationData 
                ON groupDetail.registrationID = registrationData.registrationID
                WHERE groupDetail.eventID = ? AND registrationData.registrationStatus = '2';`,
                [eventID],
            );

            const userIDs = eventRegisteredUsers.map((user) => user.userID);

            let userData = [];
            if (userIDs.length > 0) {
                const [result] = await db.query(
                    "SELECT userEmail FROM userData WHERE userID IN (?)",
                    [userIDs],
                );
                userData = result;

                const userEmails = userData.map((user) => user.userEmail);
                await sendEventMail(
                    userEmails,
                    ccEmails,
                    eventData[0].eventName,
                    announcement,
                );
            }

            return setResponseOk("Event Announcement Mail Sent Successfully!");
        } catch (err) {
            console.log("[ERROR]: Error in Mass Event Mailer Module: ", err);
            appendFileSync(
                "./logs/controller/controllerErrors.log",
                `${new Date().getTime()}-"Mass Event Mailer Module Failed"-${err}`,
            );
            return setResponseInternalError(err);
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },

    selectedParticipantsMailer: async function (
        userEmails,
        ccEmails,
        announcement,
    ) {
        try {
            await sendAnnouncementMail(userEmails, ccEmails, announcement);
            return setResponseOk("Announcement Mail Sent Succussfully !");
        } catch (err) {
            console.log("[ERROR]: Error in Mass Mailer Module: ", err);
            appendFileSync(
                "./logs/controller/controllerErrors.log",
                `${new Date().getTime}-"Mass Mailer Module Failed"-${err}`,
            );
            return setResponseInternalError(err);
        }
    },
};

export default massMailerModule;
