import { logError } from "../errorLogger.js";

const checkUserIDsExists = async function (studentID, db) {
    try {
        await db.query("LOCK TABLES userData READ");
        const [result] = await db.query(
            "SELECT userID FROM userData WHERE userID IN (?)",
            [studentID],
        );
        await db.query("UNLOCK TABLES");

        if (result.length !== studentID.length) {
            return "UserID not found in database.";
        }
        return null;
    } catch (err) {
        logError(err, "checkUserIDsExists", "db");
        return "Error occurred when checking user IDs.";
    }
};

const checkRoleIDAlreadyExists = async (roleID, db) => {
    try {
        await db.query("LOCK TABLES userRole READ");
        const [existing] = await db.query(
            "SELECT roleID FROM userRole WHERE roleID = ?",
            [roleID],
        );
        await db.query("UNLOCK TABLES");

        // If there is at least one row, that means roleID already exists
        return existing.length > 0;
    } catch (err) {
        logError(err, "checkRoleIDAlreadyExists", "db");
        return null; // indicates an internal error
    }
};

const checkRoleNameAlreadyExists = async (roleName, db) => {
    try {
        await db.query("LOCK TABLES userRole READ");
        const [existing] = await db.query(
            "SELECT roleName FROM userRole WHERE roleName = ?",
            [roleName],
        );
        await db.query("UNLOCK TABLES");

        // If there is at least one row, that means roleID already exists
        return existing.length > 0;
    } catch (err) {
        logError(err, "checkRoleNameAlreadyExists", "db");
        return null; // indicates an internal error
    }
};

export {
    checkUserIDsExists,
    checkRoleIDAlreadyExists,
    checkRoleNameAlreadyExists,
};
