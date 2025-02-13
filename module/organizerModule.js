import { pragatiDb } from "../db/poolConnection.js";
import {
    setResponseOk,
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import {
    checkOrganizerIDsExists,
    findOrganizerByNameOrPhone,
} from "../utilities/dbUtilities/organizerUtilities.js";

const organizerModule = {
    editOrganizer: async (organizerID, organizerData) => {
        const { organizerName, phoneNumber } = organizerData;
        const db = await pragatiDb.promise().getConnection();
        try {
            const existingOrganizer = await checkOrganizerIDsExists(
                [organizerID],
                db,
            );
            if (existingOrganizer) {
                return setResponseBadRequest("Organizer not found");
            }
            const duplicateOrganizer = await findOrganizerByNameOrPhone(
                organizerName,
                phoneNumber,
                organizerID,
                db,
            );
            if (duplicateOrganizer) {
                return setResponseBadRequest(
                    "Organizer with same name or phone number already exists.",
                );
            }
            // Locking the table to prevent concurrent updates to "organizerData"  table.
            await db.query("LOCK TABLES organizerData WRITE");
            const query = `UPDATE organizerData SET organizerName = ?, phoneNumber = ? WHERE organizerID = ?;`;
            const [result] = await db.query(query, [
                organizerName,
                phoneNumber,
                organizerID,
            ]);
            if (result.affectedRows === 0) {
                return setResponseBadRequest(
                    "Organizer not found or no changes made.",
                );
            }
            return setResponseOk("Organizer updated successfully.");
        } catch (error) {
            logError(error, "organizerModule:editOrganizer", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },

    removeOrganizer: async (organizerID) => {
        const db = await pragatiDb.promise().getConnection();
        try {
            // Locking the table to prevent concurrent updates to "organizerData"  table.
            await db.query("LOCK TABLES organizerData WRITE");
            // Used 'ON DELETE CASCADE' to automatically remove linked rows in organizerEventMapping when an organizer is deleted.
            const query = `DELETE FROM organizerData WHERE organizerID = ?;`;
            const [result] = await db.query(query, [organizerID]);

            if (result.affectedRows === 0) {
                return setResponseBadRequest(
                    "Organizer not found or no deletions made.",
                );
            }
            return setResponseOk("Organizer deleted successfully.");
        } catch (error) {
            logError(error, "organizerModule:removeOrganizer", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },

    addOrganizer: async (organizerName, phoneNumber) => {
        const db = await pragatiDb.promise().getConnection();
        try {
            // Utility function to check for duplicate record details
            const existingOrganizer = await findOrganizerByNameOrPhone(
                organizerName,
                phoneNumber,
                null,
                db,
            );
            if (existingOrganizer) {
                return setResponseBadRequest(
                    "Organizer with same name or phone number already exists.",
                );
            }
            // Locking the table to prevent concurrent updates to "organizerData"  table.
            await db.query("LOCK TABLES organizerData WRITE");
            const query = `INSERT INTO organizerData (organizerName, phoneNumber) VALUES(?, ?);`;
            const [result] = await db.query(query, [
                organizerName,
                phoneNumber,
            ]);
            if (result.affectedRows === 0) {
                return setResponseBadRequest("Organizer not added.");
            }
            return setResponseOk("Organizer added successfully.");
        } catch (error) {
            logError(error, "organizerModule:addOrganizer", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },

    allOrganizers: async () => {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES organizerData READ");
            const query = `SELECT * FROM organizerData;`;
            const [result] = await db.query(query);
            return setResponseOk("Organizer data fetched successfully", result);
        } catch (error) {
            logError(error, "organizerModule:allOrganizers", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
};

export default organizerModule;
