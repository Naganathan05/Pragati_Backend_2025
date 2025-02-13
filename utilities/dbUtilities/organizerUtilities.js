import { logError } from "../errorLogger.js";

const checkOrganizerIDsExists = async function (organizerIDs, db) {
    try {
        await db.query("LOCK TABLES organizerData READ");
        const [result] = await db.query(
            "SELECT organizerID FROM organizerData WHERE organizerID IN (?)",
            [organizerIDs],
        );
        await db.query("UNLOCK TABLES");
        if (result.length != organizerIDs.length) {
            return "Some or all organizer IDs not found in database";
        }
        return null;
    } catch (err) {
        logError(err, "checkOrganizerIDsExists", "db");
        return "Error Occured";
    }
};

const findOrganizerByNameOrPhone = async (
    organizerName,
    phoneNumber,
    excludeId = null,
    db,
) => {
    try {
        let query =
            "SELECT * FROM organizerData WHERE (organizerName = ? OR phoneNumber = ?)";
        const params = [organizerName, phoneNumber];

        // If excludeId is provided, add it to the query
        if (excludeId) {
            query += " AND organizerID != ?";
            params.push(excludeId);
        }

        await db.query("LOCK TABLES organizerData READ");
        const [rows] = await db.query(query, params);

        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        logError(err, "organizerUtilities.findOrganizerByNameOrPhone", "db");
        return null;
    } finally {
        await db.query("UNLOCK TABLES");
    }
};

export { checkOrganizerIDsExists, findOrganizerByNameOrPhone };
