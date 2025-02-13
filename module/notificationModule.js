import { pragatiDb } from "../db/poolConnection.js";
import { setResponseNotFound, setResponseOk } from "../utilities/response.js";

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
                return setResponseNotFound("No notifications found");
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
};

export default notificationModule;
