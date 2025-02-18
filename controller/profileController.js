import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import profileModule from "../module/profileModule.js";
import { logError } from "../utilities/errorLogger.js";
import { validateProfileData } from "../utilities/dataValidator/profile.js";
import { isValidID } from "../utilities/dataValidator/common.js";

const profileController = {
    getUserProfile: async (req, res) => {
        const { userID } = req.body;
        if (!isValidID(userID)) {
            const response = setResponseBadRequest("Invalid user ID sent!");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await profileModule.getUserProfile(userID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "profileController:getUserProfile", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    /*
    Request Header: Bearer Token
    {
      "userID": "string",
      "userName": "string",
      "rollNumber": "string",
      "phoneNumber": "string",
      "collegeName": "string",
      "collegeCity": "string",
      "userDepartment": "string",
      "academicYear": "number",
      "degree": "string",
      "needAccommodationDay1": "boolean",
      "needAccommodationDay2": "boolean",
      "needAccommodationDay3": "boolean",
      "isAmrita": "boolean",
    }
    */
    editProfile: async (req, res) => {
        const {
            userID,
            userName,
            rollNumber,
            phoneNumber,
            collegeName,
            collegeCity,
            userDepartment,
            academicYear,
            degree,
            needAccommodationDay1,
            needAccommodationDay2,
            needAccommodationDay3,
            isAmrita,
        } = req.body;

        const validationErrordata = validateProfileData(req.body);
        if (validationErrordata != null) {
            const response = setResponseBadRequest(validationErrordata);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await profileModule.editProfile(
                userID,
                userName,
                rollNumber,
                phoneNumber,
                collegeName,
                collegeCity,
                userDepartment,
                academicYear,
                degree,
                needAccommodationDay1,
                needAccommodationDay2,
                needAccommodationDay3,
                isAmrita,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "profileController:editProfile", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default profileController;
