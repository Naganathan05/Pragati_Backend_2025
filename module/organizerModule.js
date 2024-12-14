import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";

const organizerModule = {
  editOrganizer: async (organizerID, organizerData) => {
    const { organizerName, phoneNumber } = organizerData;
    const db = await pragatiDb.promise().getConnection();
    try {
      // Locking the table to prevent concurrent updates to "organizerData"  table.
      await db.query("LOCK TABLES organizerData WRITE");
      const query = `UPDATE organizerData SET organizerName = ?, phoneNumber = ? WHERE organizerID = ?;`;
      const [result] = await db.query(query, [organizerName, phoneNumber, organizerID]);
      if (result.affectedRows === 0) {
        return setResponseBadRequest("Organizer not found or no changes made.");
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
};

export default organizerModule;
