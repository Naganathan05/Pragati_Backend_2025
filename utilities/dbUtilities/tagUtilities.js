import { logError } from "../errorLogger.js";

const checkTagIDsExists = async function (tagIDs, db) {
    try {
        await db.query("LOCK TABLES tagData READ");
        const [result] = await db.query(
            "SELECT tagID FROM tagData WHERE tagID IN (?)",
            [tagIDs],
        );
        await db.query("UNLOCK TABLES");
        if (result.length != tagIDs.length) {
            return "Some or all tag IDs not found in database";
        }
        return null;
    } catch (err) {
        logError(err, "checkTagIDsExists", "db");
        return "Error Occured";
    }
};

const findTagByNameOrAbbreviation = async (
    tagName,
    tagAbbrevation,
    excludeId = null,
    db,
) => {
    try {
        let query =
            "SELECT * FROM tagData WHERE (tagName = ? OR tagAbbrevation = ?)";
        const params = [tagName, tagAbbrevation];

        // If excludeId is provided, exclude that tag (useful for updates)
        if (excludeId) {
            query += " AND tagID != ?";
            params.push(excludeId);
        }

        await db.query("LOCK TABLES tagData READ");
        const [rows] = await db.query(query, params);

        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        logError(err, "tagUtilities.findTagByNameOrAbbreviation", "db");
        return null;
    } finally {
        await db.query("UNLOCK TABLES");
    }
};

export { checkTagIDsExists, findTagByNameOrAbbreviation };
