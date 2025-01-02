import {
  setResponseOk,
  setResponseBadRequest,
  setResponseInternalError,
  setResponseNotFound,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { pragatiDb } from "../db/poolConnection.js";
import { checkClubIDsExists } from "../utilities/dbUtilities/clubUtilities.js";
import { checkOrganizerIDsExists } from "../utilities/dbUtilities/organizerUtilities.js";
import { checkTagIDsExists } from "../utilities/dbUtilities/tagUtilities.js";

const eventModule = {
  addEvent: async function (
    eventName,
    imageUrl,
    eventFee,
    eventDescription,
    eventDescSmall,
    isGroup,
    eventDate,
    maxRegistrations,
    isPerHeadFee,
    godName,
    organizerIDs,
    tagIDs,
    clubID,
    minTeamSize,
    maxTeamSize
  ) {
    const db = await pragatiDb.promise().getConnection();
    var transactionStarted = 0;
    try {
      // Checking if organizer IDs are present in the database
      const organizersExists = await checkOrganizerIDsExists(organizerIDs, db);
      if (organizersExists !== null) {
        await db.rollback();
        return setResponseBadRequest(organizersExists);
      }

      // Checking if club IDs are present in the database
      const clubsExists = await checkClubIDsExists([clubID], db);
      if (clubsExists !== null) {
        // console.log("Error Club not found");
        await db.rollback();
        return setResponseBadRequest(clubsExists);
      }

      // Checking if tag IDs are present in the database
      const tagExists = await checkTagIDsExists(tagIDs, db);
      if (tagExists !== null) {
        // console.log("Error tag IDs not found");
        await db.rollback();
        return setResponseBadRequest(tagExists);
      }

      await db.beginTransaction();
      // Denotes that server entered the Transaction -> Needs rollback incase of error.
      transactionStarted = 1;

      const query = `
      INSERT INTO eventData (eventName, imageUrl, eventFee, eventDescription, eventDescSmall,
       isGroup, eventDate, maxRegistrations, isPerHeadFee, godName, minTeamSize, maxTeamSize)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
      `;
      const values = [
        eventName,
        imageUrl,
        eventFee,
        eventDescription,
        eventDescSmall,
        isGroup,
        eventDate,
        maxRegistrations,
        isPerHeadFee,
        godName,
        minTeamSize,
        maxTeamSize,
      ];
      const [insertData] = await db.query(query, values);
      const eventID = insertData.insertId;
      if (eventID == null) {
        await db.rollback();
        return setResponseInternalError("Could not add event properly");
      }

      // Insert into organizerEventMapping table using a single query
      const organizerValues = organizerIDs.map((organizerID) => [
        organizerID,
        eventID,
      ]);
      await db.query(
        `INSERT INTO organizerEventMapping (organizerID, eventID)
        VALUES ?`,
        [organizerValues]
      );

      // Insert into tagEventMapping table using a single query
      const tagEventMapping = tagIDs.map((tagID) => [tagID, eventID]);
      await db.query(
        `INSERT INTO tagEventMapping (tagID, eventID)
        VALUES ?`,
        [tagEventMapping]
      );

      // Insert into clubEventMapping table
      await db.query(
        `INSERT INTO clubEventMapping (clubID, eventID) values (?,?)`,
        [clubID, eventID]
      );
      await db.commit();
      return setResponseOk("Event added successfully");
    } catch (err) {
      if (transactionStarted === 1) {
        await db.rollback();
      }
      if (err.code == "ER_DUP_ENTRY") {
        return setResponseBadRequest("Event already found in database");
      }
      logError(err, "eventModule:addEvent", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
  getAllEvents: async function () {
    const db = await pragatiDb.promise().getConnection();
    try {
      const [events] = await db.query(`SELECT 
    e.eventID,
    e.eventName,
    e.eventDate,
    e.eventDescription,
    e.eventFee,
    e.imageUrl AS eventImageUrl,


    JSON_ARRAYAGG(
        JSON_OBJECT(
            'organizerID', o.organizerID,
            'organizerName', o.organizerName,
            'organizerPhoneNumber', o.phoneNumber
        )
    ) AS organizers,


    JSON_ARRAYAGG(
        JSON_OBJECT(
            'tagID', t.tagID,
            'tagName', t.tagName,
            'tagAbbrevation', t.tagAbbrevation
        )
    ) AS tags,


    c.clubID,
    c.clubName,
    c.imageUrl AS clubImageUrl,
    c.clubHead,
    c.clubAbbrevation,
    c.godName

FROM 
    eventData e
LEFT JOIN 
    organizerEventMapping oem ON e.eventID = oem.eventID
LEFT JOIN 
    organizerData o ON oem.organizerID = o.organizerID
LEFT JOIN 
    tagEventMapping tem ON e.eventID = tem.eventID
LEFT JOIN 
    tagData t ON tem.tagID = t.tagID
LEFT JOIN 
    clubEventMapping cem ON e.eventID = cem.eventID
LEFT JOIN 
    clubData c ON cem.clubID = c.clubID


GROUP BY 
    e.eventID, e.eventName, e.eventDate, e.eventDescription, e.eventFee, e.imageUrl,
    c.clubID, c.clubName, c.imageUrl, c.clubHead, c.clubAbbrevation, c.godName;
`);
      if (events.length == 0) {
        return setResponseNotFound("No events found!");
      }
      return setResponseOk("All events selected", events);
    } catch (err) {
      logError(err, "eventModule:getAllEvents", "db");
      return setResponseInternalError();
    } finally {
      db.release();
    }
  },
  getEventDetailsByID: async function (eventID) {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query("LOCK TABLES eventData READ");
      const [event] = await db.query(
        "SELECT * FROM eventData WHERE eventID = ?",
        [eventID]
      );
      if (event.length == 0) {
        return setResponseNotFound("No events found!");
      }
      return setResponseOk("Event selected", event);
    } catch (err) {
      logError(err, "eventModule:getEventDetailsByID", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
  getEventForClub: async function (clubID) {
    const db = await pragatiDb.promise().getConnection();
    try {
      await db.query("LOCK TABLES eventData READ, clubEventMapping READ");
      const [events] = await db.query(
        `SELECT 
            eventData.eventDate, 
            eventData.eventDescSmall, 
            eventData.eventDescription, 
            eventData.eventFee, 
            eventData.eventID, 
            eventData.eventName, 
            eventData.eventStatus, 
            eventData.godName, 
            eventData.imageUrl, 
            eventData.isGroup, 
            eventData.isPerHeadFee, 
            eventData.maxRegistrations, 
            eventData.maxTeamSize, 
            eventData.minTeamSize, 
            eventData.numRegistrations 
          FROM 
            eventData 
          JOIN 
            clubEventMapping 
            ON eventData.eventID = clubEventMapping.eventID 
          WHERE 
            clubID = ?`,
        [clubID]
      );

      if (events.length == 0) {
        return setResponseNotFound("No events found for the given club!");
      }
      return setResponseOk("Event selected", events);
    } catch (err) {
      logError(err, "eventModule:getEventDetailsByID", "db");
      return setResponseInternalError();
    } finally {
      await db.query("UNLOCK TABLES");
      db.release();
    }
  },
};

export default eventModule;
