import { logError } from "../errorLogger.js";

// Check if a user exists by email
const isUserExistsByEmail = async function (email, db) {
    try {
        await db.query("LOCK TABLES userData READ");
        const [result] = await db.query(
            "SELECT * FROM userData WHERE userEmail = ?",
            [email],
        );
        await db.query("UNLOCK TABLES");
        return result.length > 0 ? result : null;
    } catch (err) {
        logError(err, "isUserExistsByEmail", "db");
        throw new Error("Database query failed.");
    } finally {
        await db.query("UNLOCK TABLES");
    }
};

// Check if a user exists by userID
const isUserExistsByUserID = async function (userID, db) {
    try {
        await db.query("LOCK TABLES userData READ");
        const [result] = await db.query(
            "SELECT * FROM userData WHERE userID = ?",
            [userID],
        );
        await db.query("UNLOCK TABLES");
        return result.length > 0 ? result : null;
    } catch (err) {
        logError(err, "isUserExistsByUserID", "db");
        throw new Error("Database query failed.");
    } finally {
        await db.query("UNLOCK TABLES");
    }
};

export { isUserExistsByEmail, isUserExistsByUserID };
