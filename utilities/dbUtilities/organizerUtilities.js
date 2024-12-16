import { logError } from "../errorLogger.js";

const checkOrganizerIDsExists = async function (organizerIDs, db) {
  try {
    await db.query("LOCK TABLES organizerData READ");
    const [result] = await db.query(
      "SELECT organizerID FROM organizerData WHERE organizerID IN (?)",
      [organizerIDs]
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

export { checkOrganizerIDsExists };
