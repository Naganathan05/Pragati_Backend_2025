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
  removeOrganizer: async (organizerID) => {
    const db = await pragatiDb.promise().getConnection();
    try {      
      // Locking the table to prevent concurrent updates to "organizerData"  table.
      await db.query("LOCK TABLES organizerData WRITE");
      // Used ON DELETE CASCADE to automatically remove linked rows in organizerEventMapping when an organizer is deleted.
      const query = `DELETE FROM organizerData WHERE organizerID = ?;`;
      const [result] = await db.query(query, [organizerID]);
      
      if (result.affectedRows === 0) {
        return setResponseBadRequest("Organizer not found or no deletions made.");
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
};

export default organizerModule;
