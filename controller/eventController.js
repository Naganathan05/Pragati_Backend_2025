import eventModule from "../module/eventModule.js";
import { validateAddEventData } from "../utilities/dataValidator/event.js";
import { setResponseBadRequest } from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { setResponseInternalError } from "../utilities/response.js";
import { isValidID } from "../utilities/dataValidator/common.js";

const eventController = {
    /*
    Request Header: Bearer Token
    {
      "eventName": "string",
      "imageUrl": "string",
      "eventFee": number,
      "eventDescription": "string",
      "venue": "string",
      "time": "string",
      "rules": "string",
      "isGroup": "boolean",
      "maxTeamSize": number,
      "minTeamSize": number,
      "eventDate": "character",
      "maxRegistrations": number,
      "isPerHeadFee": "boolean",
      "firstPrice": "string",
      "secondPrice": "string",
      "thirdPrice": "string",
      "fourthPrice": "string",
      "fifthPrice": "string",
      "godName": "string",
      "organizerIDs": [number, number,...],
      "tagIDs": [number, number,...],
      "clubID": number
    }
  */
    addEvent: async (req, res) => {
        const {
            eventName,
            imageUrl,
            eventFee,
            eventDescription,
            venue,
            time,
            rules,
            isGroup,
            eventDate,
            maxRegistrations,
            isPerHeadFee,
            firstPrice,
            secondPrice,
            thirdPrice,
            fourthPrice,
            fifthPrice,
            godName,
            organizerIDs,
            tagIDs,
            clubID,
        } = req.body;

        //validating the req.body
        const errors = validateAddEventData(req.body);
        if (errors != null) {
            const response = setResponseBadRequest(errors);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        // assigning default value to team size, as it will be undefined if isGroup is false
        let maxTeamSize = 1;
        let minTeamSize = 1;

        if (isGroup === true) {
            maxTeamSize = req.body.maxTeamSize || 1;
            minTeamSize = req.body.minTeamSize || 1;
        }
        try {
            // not passing sending req.body.userID as it will be checked during login itself
            const response = await eventModule.addEvent(
                eventName,
                imageUrl,
                eventFee,
                eventDescription,
                venue,
                time,
                rules,
                isGroup,
                eventDate,
                maxRegistrations,
                isPerHeadFee,
                firstPrice,
                secondPrice,
                thirdPrice,
                fourthPrice,
                fifthPrice,
                godName,
                organizerIDs,
                tagIDs,
                clubID,
                minTeamSize,
                maxTeamSize,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "eventController:addEvent", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    getAllEvents: async (req, res) => {
        try {
            const response = await eventModule.getAllEvents(
                req.body.isLoggedIn,
                req.body.userID,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "eventController:getAllEvents", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    getEventDetailsByID: async (req, res) => {
        const { eventID } = req.params;
        if (!isValidID(eventID)) {
            const response = setResponseBadRequest("valid event ID not found");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        try {
            const response = await eventModule.getEventDetailsByID(
                eventID,
                req.body.isLoggedIn,
                req.body.userID,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "eventController:getEventDetailsByID", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    getEventForClub: async (req, res) => {
        const { clubID } = req.params;
        if (!isValidID(clubID)) {
            const response = setResponseBadRequest("valid club ID not found");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        try {
            const response = await eventModule.getEventForClub(
                clubID,
                req.body.isLoggedIn,
                req.body.userID,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "eventController:getEventForClub", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    getEventsRegisteredByUser: async (req, res) => {
        const { id } = req.params;
        // typeof id should be string(usually query params are strings).
        if (!isValidID(id)) {
            const response = setResponseBadRequest("valid user ID not found");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        try {
            const response = await eventModule.getEventsRegisteredByUser(
                id,
                req.body.isLoggedIn,
                req.body.userID,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "eventController:getEventsRegisteredByUser", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    /*
    Request Header: Bearer Token
    {
      "eventID": number,
      "eventName": "string",
      "imageUrl": "string",
      "eventFee": number,
      "eventDescription": "string",
      "venue": "string",
      "time": "string",
      "rules": "string",
      "isGroup": "boolean",
      "maxTeamSize": number,
      "minTeamSize": number,
      "eventDate": "character",
      "maxRegistrations": number,
      "isPerHeadFee": "boolean",
      "firstPrice": "string",
      "secondPrice": "string",
      "thirdPrice": "string",
      "fourthPrice": "string",
      "fifthPrice": "string",
      "godName": "string",
      "organizerIDs": [number, number,...],
      "tagIDs": [number, number,...],
      "clubID": number
    }
  */
    editEvent: async (req, res) => {
        const {
            eventID,
            eventName,
            imageUrl,
            eventFee,
            eventDescription,
            venue,
            time,
            rules,
            isGroup,
            eventDate,
            maxRegistrations,
            isPerHeadFee,
            firstPrice,
            secondPrice,
            thirdPrice,
            fourthPrice,
            fifthPrice,
            godName,
            organizerIDs,
            tagIDs,
            clubID,
        } = req.body;
        if (!isValidID(eventID.toString())) {
            const response = setResponseBadRequest(
                "eventID should be a valid number",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        const errors = validateAddEventData(req.body);
        if (errors != null) {
            const response = setResponseBadRequest(errors);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        // assigning default value to team size, as it will be undefined if isGroup is false
        let maxTeamSize = 1;
        let minTeamSize = 1;

        if (isGroup === true) {
            maxTeamSize = req.body.maxTeamSize || 1;
            minTeamSize = req.body.minTeamSize || 1;
        }
        try {
            // not passing sending req.body.userID as it will be checked during login itself (Updated: Ehh?)
            const response = await eventModule.editEvent(
                eventID,
                eventName,
                imageUrl,
                eventFee,
                eventDescription,
                venue,
                time,
                rules,
                isGroup,
                eventDate,
                maxRegistrations,
                isPerHeadFee,
                firstPrice,
                secondPrice,
                thirdPrice,
                fourthPrice,
                fifthPrice,
                godName,
                organizerIDs,
                tagIDs,
                clubID,
                minTeamSize,
                maxTeamSize,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "eventController:editEvent", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    toggleStatus: async (req, res) => {
        const { eventID } = req.body;
        if (!isValidID(eventID.toString())) {
            const response = setResponseBadRequest(
                "eventID should be a valid number",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        try {
            const response = await eventModule.toggleStatus(eventID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "eventController:toggleStatus", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    /*
  Request Header: Bearer Token
    {
      "eventID": "number", => as string
    }
  */
    deleteEvent: async (req, res) => {
        const { eventID } = req.body;
        if (!isValidID(eventID)) {
            const response = setResponseBadRequest("valid event ID not found");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        try {
            const response = await eventModule.deleteEvent(eventID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "eventController:deleteEvent", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default eventController;
