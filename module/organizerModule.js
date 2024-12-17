import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseBadRequest, setResponseInternalError, setResponseNotFound } from "../utilities/response.js";
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

  addOrganizer: async(organizerName, phoneNumber) => {
    const db = await pragatiDb.promise().getConnection();
    try {      
      // Locking the table to prevent concurrent updates to "organizerData"  table.
      await db.query("LOCK TABLES organizerData WRITE");
      const query = `INSERT INTO organizerData (organizerName, phoneNumber) VALUES(?, ?);`;
      const [result] = await db.query(query, [organizerName, phoneNumber]);
      if (result.affectedRows === 0) {
        return setResponseBadRequest("Organizer not added.");
      }
      return setResponseOk("Organizer added successfully.");
    }catch (error) {
      logError(error, "organizerModule:addOrganizer", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
  getAllOrganizer: async () => {
    const db = await pragatiDb.promise().getConnection();
    try {
      const [organizers] = await db.query("SELECT * FROM organizerData;");
      if (organizers.length === 0) {
        return setResponseNotFound("No organizers found.");
      }
      return setResponseOk("All Organizers retrieved successfully.", organizers);
    } catch (error) {
      logError(error, "organizerModule:getAllOrganizer", "db");
      return setResponseInternalError();
    } finally {
      db.release();
    }
  },
};

export default organizerModule;
