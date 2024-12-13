import {setResponseBadRequest, setResponseInternalError } from "../utilities/response.js";
import userModule from "../module/organizerModule.js";
import { logError } from "../utilities/errorLogger.js";
import { validateOrganizerData } from "../utilities/dataValidator.js";

const userController = {
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
            return res.status(response.responseCode).json(response.responseBody);
        }
    
        try {
            const response = await userModule.editOrganizer(organizerData.organizerID, organizerData);
            return res.status(response.responseCode).json(response.responseBody);
        } catch (error) {
            logError(error, "userController:editOrganizer", "db");
            const response = setResponseInternalError();
            return res.status(response.responseCode).json(response.responseBody);
        }
    },
    removeOrganizer: async (req, res) => {},
    /* 
        Comment for addOrganiser function
    */
    addOrganizer: async (req, res) => {},

};


export default userController;
