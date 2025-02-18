import { pragatiDb } from "../db/poolConnection.js";
import {
    setResponseNotFound,
    setResponseOk,
    setResponseInternalError,
    setResponseBadRequest,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";

const notificationModule = {
    getAllNotifications: async function () {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES notification READ");
            const [noties] = await db.query(`
            SELECT 
              notificationID,
              title,
              description,
              author,
              venue,
              startDate,
              endDate FROM notification`);
            if (noties.length == 0) {
                return setResponseOk("No notifications found", []);
            }
            return setResponseOk("All notifications selected", noties);
        } catch (err) {
            logError(err, "notificationModule:getAllNotifications", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    addNotification: async function (
        title,
        description,
        author,
        venue,
        startDate,
        endDate,
    ) {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query(`LOCK TABLES notification WRITE`);
            const [result] = await db.query(
                `INSERT INTO notification (
              title,
              description,
              author,
              venue,
              startDate,
              endDate
            ) VALUES (?,?,?,?,?,?)`,
                [title, description, author, venue, startDate, endDate],
            );
            return setResponseOk("Notification event added successfully!");
        } catch (err) {
            logError(err, "notificationModule:addNotification", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    updateNotification: async function (
        notificationID,
        title,
        description,
        author,
        venue,
        startDate,
        endDate,
    ) {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query(`LOCK TABLES notification WRITE`);
            const [updateResult] = await db.query(
                `UPDATE notification SET
              title = ?,
              description = ?,
              author = ?,
              venue = ?,
              startDate = ?,
              endDate = ? 
              WHERE notificationID = ?`,
                [
                    title,
                    description,
                    author,
                    venue,
                    startDate,
                    endDate,
                    notificationID,
                ],
            );
            if (updateResult.affectedRows === 0) {
                await db.rollback();
                return setResponseBadRequest(
                    "Notification not found or update failed",
                );
            }
            return setResponseOk("Notification updated successfully!");
        } catch (err) {
            logError(err, "notificationModule:updateNotification", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    deleteNotification: async function (notificationID) {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES notification WRITE");
            const [deleted] = await db.query(
                "DELETE  FROM notification WHERE notificationID = ?",
                [notificationID],
            );
            if (deleted.affectedRows == 0) {
                return setResponseBadRequest(
                    "Notification event ID not found in database!",
                );
            }
            return setResponseOk("Deleted successfully :)");
        } catch (err) {
            logError(err, "notificationModule:deleteNotification", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
};

export default notificationModule;
