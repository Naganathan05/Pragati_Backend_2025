import { logError } from "../errorLogger.js";

const checkClubIDsExists = async function (clubIDs, db) {
    try {
        await db.query("LOCK TABLES clubData READ");
        const [result] = await db.query(
            "SELECT clubID FROM clubData WHERE clubID IN (?)",
            [clubIDs],
        );
        await db.query("UNLOCK TABLES");
        if (result.length != clubIDs.length) {
            return "Some or all club IDs not found in database";
        }
        return null;
    } catch (err) {
        logError(err, "checkClubIDsExists", "db");
        return "Error Occured";
    }
};

// Check if a duplicate club exists
const checkDuplicateClub = async function ({
    clubName,
    clubAbbrevation,
    db,
    excludeClubID = null,
}) {
    try {
        await db.query("LOCK TABLES clubData READ");
        let query = `
      SELECT * FROM clubData
      WHERE (clubName = ? OR clubAbbrevation = ?)
    `;
        const params = [clubName, clubAbbrevation];

        // Exclude the current club ID for edit operations
        if (excludeClubID) {
            query += " AND clubID != ?";
            params.push(excludeClubID);
        }

        const [result] = await db.query(query, params);
        return result.length > 0; // Return true if duplicate exists
    } catch (error) {
        logError(error, "clubModule:checkDuplicateClub", "db");
        throw error;
    } finally {
        db.query("UNLOCK TABLES");
        db.release();
    }
};

export { checkClubIDsExists, checkDuplicateClub };
