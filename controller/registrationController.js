// helper functions for data validation and consistent response
import {
  setResponseOk,
  setResponseBadRequest,
  setResponseInternalError,
} from "../utilities/response.js";

import registrationModule from "../module/registrationModule.js";
import { validateEventRegistration } from "../utilities/Validator/registrationValidator.js";

const registrationController = {
  /*
    Request Header: Bearer OTP Token
    Add Registration Request Body
    {
        "eventID": "integer" [Mandatory],
        "totalMembers": "integer" [Mandatory],
        "teamName": "string" [Mandatory],
        "teamMembers": "Array[String]",
        "memberRoles": "Array[String]"
    }
  */
    addRegistration: async (req, res) => {
        const { userID, eventID, totalMembers, teamName, teamMembers, memberRoles } = req.body;
        if(!(validateEventRegistration(userID, eventID, totalMembers, teamName))) {
            const response = setResponseBadRequest("Invalid Registration Data");
            return res.status(response.responseCode).json(response.responseBody);
        }

        // teamMembers and memberRoles can undefined if registration is for one member.
        // They will be validated inside module incase of registration of a team.
        try {
            const registrationResponse = await registrationModule.addRegistration(userID, eventID, totalMembers, teamName, teamMembers, memberRoles);
            return res.status(registrationResponse.responseCode).json(registrationResponse.responseBody);
        } catch (error) {
            console.log("[ERROR]: Error in Add Registration Controller: ", error);
            const response = setResponseInternalError();
            return res.status(response.responseCode).json(response.responseBody);
        }
    },
}

export default registrationController;