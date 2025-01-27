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
import { getEventQueryFormatter } from "../utilities/dbUtilities/eventUtilities.js";

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
        maxTeamSize,
    ) {
        const db = await pragatiDb.promise().getConnection();
        var transactionStarted = 0;
        try {
            // Checking if organizer IDs are present in the database
            const organizersExists = await checkOrganizerIDsExists(
                organizerIDs,
                db,
            );
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
                [organizerValues],
            );

            // Insert into tagEventMapping table using a single query
            const tagEventMapping = tagIDs.map((tagID) => [tagID, eventID]);
            await db.query(
                `INSERT INTO tagEventMapping (tagID, eventID)
        VALUES ?`,
                [tagEventMapping],
            );

            // Insert into clubEventMapping table
            await db.query(
                `INSERT INTO clubEventMapping (clubID, eventID) values (?,?)`,
                [clubID, eventID],
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
    getAllEvents: async function (isLoggedIn, userID) {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query(
                `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        clubEventMapping AS cem READ,  
        clubData AS c READ,
        registrationData AS rg READ,
        groupDetail AS g READ`,
            );
            const query = getEventQueryFormatter(isLoggedIn, userID);
            // console.log(query);
            const [events] = await db.query(query);
            if (events.length == 0) {
                return setResponseNotFound("No events found!");
            }
            return setResponseOk("All events selected", events);
        } catch (err) {
            logError(err, "eventModule:getAllEvents", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    getEventDetailsByID: async function (eventID, isLoggedIn, userID) {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query(
                `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        clubEventMapping AS cem READ,  
        clubData AS c READ,
        registrationData AS rg READ,
        groupDetail AS g READ`,
            );
            let query = getEventQueryFormatter(isLoggedIn, userID, {
                eventID: eventID,
            });
            // console.log(query);
            const [event] = await db.query(query);
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
    getEventForClub: async function (clubID, isLoggedIn, userID) {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query(
                `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        clubEventMapping AS cem READ,  
        clubData AS c READ,
        registrationData AS rg READ,
        groupDetail AS g READ`,
            );
            const query = getEventQueryFormatter(isLoggedIn, userID, {
                clubID: clubID,
            });
            const [events] = await db.query(query);

            if (events.length == 0) {
                return setResponseNotFound(
                    "No events found for the given club!",
                );
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
    getEventsRegisteredByUser: async function (id, isLoggedIn, userID) {
        const db = await pragatiDb.promise().getConnection();
        try {
            await db.query(
                `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        clubEventMapping AS cem READ,  
        clubData AS c READ,
        registrationData AS rg READ,
        registrationData READ,
        groupDetail AS g READ`,
            );
            const [eventIDs] = await db.query(
                "SELECT rg.eventID FROM registrationData rg JOIN groupDetail g ON rg.registrationID = g.registrationID WHERE g.userID = ?",
                [id],
            );
            // console.log(eventIDs);
            if (eventIDs.length == 0) {
                return setResponseNotFound(
                    "No registered events found for user.",
                );
            }
            const eventIDsNew = eventIDs.map(
                (eventIDObject) => eventIDObject.eventID,
            );
            const query = getEventQueryFormatter(isLoggedIn, userID, {
                eventIDs: eventIDsNew,
            });
            const [events] = await db.query(query);
            if (events.length == 0) {
                return setResponseNotFound(
                    "No registered events found for user.",
                );
            }
            return setResponseOk("Registered events fetched", events);
        } catch (err) {
            logError(err, "eventModule:getEventsRegisteredByUser", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
};

export default eventModule;
