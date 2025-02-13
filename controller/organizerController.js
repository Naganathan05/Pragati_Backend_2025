import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import organizerModule from "../module/organizerModule.js";
import { logError } from "../utilities/errorLogger.js";
import {
    validateOrganizer,
    validateOrganizerData,
    validateRemoveOrganizerData,
} from "../utilities/dataValidator/organizer.js";

const organizerController = {
    /* 
        Edit Organizer request body
        {
            "organizerID": "integer",
            "organizerName": "string",
            "phoneNumber": "string",
        }
    */
    editOrganizer: async (req, res) => {
        const organizerData = req.body;

        // Validate organizer data
        const validationError = validateOrganizerData(organizerData);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await organizerModule.editOrganizer(
                organizerData.organizerID,
                organizerData,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "organizerController:editOrganizer", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    /* 
        Remove Organizer request body
        {
            "organizerID": "integer"
        }
    */
    removeOrganizer: async (req, res) => {
        const { organizerID } = req.body;

        // Validate organizer data
        const validationError = validateRemoveOrganizerData(organizerID);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await organizerModule.removeOrganizer(organizerID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "organizerController:removeOrganizer", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    /* 
        Add Organizer request body
        {
            "organizerName": "string",
            "phoneNumber": "string"
        }
    */
    addOrganizer: async (req, res) => {
        const { organizerName, phoneNumber } = req.body;

        // Validate organizer data
        const validationError = validateOrganizer(organizerName, phoneNumber);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await organizerModule.addOrganizer(
                organizerName,
                phoneNumber,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "organizerController:editOrganizer", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    allOrganizers: async (_, res) => {
        try {
            const response = await organizerModule.allOrganizers();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "organizerController:allOrganizers", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default organizerController;
