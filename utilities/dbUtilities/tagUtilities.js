import { logError } from "../errorLogger.js";

const checkTagIDsExists = async function (tagIDs, db) {
  try {
    await db.query("LOCK TABLES tagData READ");
    const [result] = await db.query(
      "SELECT tagID FROM tagData WHERE tagID IN (?)",
      [tagIDs]
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

export { checkTagIDsExists };
