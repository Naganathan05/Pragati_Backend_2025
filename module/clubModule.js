import { pragatiDb } from "../db/poolConnection.js";
import { setResponseOk, setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";

const clubModule = {
  // Fetch all clubs
  getAllClubs: async () => {
    const db = await pragatiDb.promise().getConnection();
    try {
      const query = "SELECT * FROM clubdata";
      const [result] = await db.query(query);
      return setResponseOk(result);
    } catch (error) {
      logError(error, "clubModule:getAllClubs", "db");
      return setResponseInternalError();
    } finally {
      db.release();
    }
  },

  // Add a club
  addClub: async (clubData) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      const query = `
        INSERT INTO clubdata (clubName, imageUrl, clubHead, clubAbbrevation, godName)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [clubData.clubName, clubData.imageUrl, clubData.clubHead, clubData.clubAbbrevation, clubData.godName];
      const [result] = await db.query(query, values);
      return setResponseOk({ message: "Club added successfully", clubID: result.insertId });
    } catch (error) {
      logError(error, "clubModule:addClub", "db");
      return setResponseInternalError();
    } finally {
      db.release();
    }
  },

  // Edit a club
  editClub: async (clubData) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      const query = `
        UPDATE clubdata 
        SET clubName = ?, imageUrl = ?, clubHead = ?, clubAbbrevation = ?, godName = ?
        WHERE clubID = ?
      `;
      const values = [clubData.clubName, clubData.imageUrl, clubData.clubHead, clubData.clubAbbrevation, clubData.godName, clubData.clubID];
      const [result] = await db.query(query, values);

      if (result.affectedRows === 0) {
        return setResponseBadRequest("Club not found or no changes made.");
      }
      return setResponseOk("Club updated successfully.");
    } catch (error) {
      logError(error, "clubModule:editClub", "db");
      return setResponseInternalError();
    } finally {
      db.release();
    }
  },

  // Remove a club
  removeClub: async (clubID) => {
    const db = await pragatiDb.promise().getConnection();
    try {
      const query = "DELETE FROM clubdata WHERE clubID = ?";
      const [result] = await db.query(query, [clubID]);

      if (result.affectedRows === 0) {
        return setResponseBadRequest("Club not found or already deleted.");
      }
      return setResponseOk("Club removed successfully.");
    } catch (error) {
      logError(error, "clubModule:removeClub", "db");
      return setResponseInternalError();
    } finally {
      db.release();
    }
  },
};

export default clubModule;
