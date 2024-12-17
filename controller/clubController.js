import { setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import clubModule from "../module/clubModule.js";
import { logError } from "../utilities/errorLogger.js";
import { validateClubData, validateClubID } from "../utilities/dataValidator/club.js";

const clubController = {
  // Fetch all clubs
  getAllClubs: async (req, res) => {
    try {
      const response = await clubModule.getAllClubs();
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "clubController:getAllClubs", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },

  // Add a new club
  addClub: async (req, res) => {
    const clubData = req.body;

    // Validate input data
    const validationError = validateClubData(clubData);
    if (validationError) {
      const response = setResponseBadRequest(validationError);
      return res.status(response.responseCode).json(response.responseBody);
    }

    try {
      const response = await clubModule.addClub(clubData);
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "clubController:addClub", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },

  // Edit a club
  editClub: async (req, res) => {
    const clubData = req.body;

    // Validate input data
    const validationError = validateClubData(clubData);
    if (validationError) {
      const response = setResponseBadRequest(validationError);
      return res.status(response.responseCode).json(response.responseBody);
    }

    try {
      const response = await clubModule.editClub(clubData);
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "clubController:editClub", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },

  // Remove a club
  removeClub: async (req, res) => {
    const { clubID } = req.params;

    // Validate club ID
    // const validationError = validateClubID(clubID);
    // if (validationError) {
    //   const response = setResponseBadRequest(validationError);
    //   return res.status(response.responseCode).json(response.responseBody);
    // }

    try {
      const response = await clubModule.removeClub(clubID);
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "clubController:removeClub", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },
};

export default clubController;
