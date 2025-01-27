import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import clubModule from "../module/clubModule.js";
import { logError } from "../utilities/errorLogger.js";
import {
    validateClubData,
    validateClubID,
} from "../utilities/dataValidator/club.js";

const clubController = {
    // Fetch all clubs
    getAllClubs: async (req, res) => {
        try {
            const response = await clubModule.getAllClubs();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "clubController:getAllClubs", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    // Add a new club
    addClub: async (req, res) => {
        const { clubName, imageUrl, clubHead, clubAbbrevation, godName } =
            req.body;

        // Validate input data
        const validationError = validateClubData(req.body);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            // Add the club
            const response = await clubModule.addClub({
                clubName,
                imageUrl,
                clubHead,
                clubAbbrevation,
                godName,
            });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "clubController:addClub", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    // Edit a club
    editClub: async (req, res) => {
        const {
            clubID,
            clubName,
            imageUrl,
            clubHead,
            clubAbbrevation,
            godName,
        } = req.body;

        // Validate input data
        const validationError = validateClubData(req.body);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        // Validate club ID
        const idValidationError = validateClubID(clubID);
        if (idValidationError) {
            const response = setResponseBadRequest(idValidationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            // Edit the club
            const response = await clubModule.editClub({
                clubID,
                clubName,
                imageUrl,
                clubHead,
                clubAbbrevation,
                godName,
            });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "clubController:editClub", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    // Remove a club
    removeClub: async (req, res) => {
        const { clubID } = req.body;

        // Validate club ID
        const idValidationError = validateClubID(clubID);
        if (idValidationError) {
            const response = setResponseBadRequest(idValidationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await clubModule.removeClub(clubID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "clubController:removeClub", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default clubController;
