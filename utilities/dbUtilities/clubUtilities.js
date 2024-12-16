import { logError } from "../errorLogger.js";

const checkClubIDsExists = async function (clubIDs, db) {
  try {
    await db.query("LOCK TABLES clubData READ");
    const [result] = await db.query(
      "SELECT clubID FROM clubData WHERE clubID IN (?)",
      [clubIDs]
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

export { checkClubIDsExists };
