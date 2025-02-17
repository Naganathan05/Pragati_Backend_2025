// helper functions for data validation and consistent response
import {
    validateEmail,
    validateOTP,
    validatePassword,
    validateSignupData,
} from "../utilities/dataValidator/auth.js";

import {
    setResponseOk,
    setResponseBadRequest,
    setResponseUnauth,
    setResponseInternalError,
} from "../utilities/response.js";

// authorization module for database access
import authModule from "../module/authModule.js";
import { logError } from "../utilities/errorLogger.js";

const authController = {
    /*
    Login request body
    {
        "userEmail": "string",
        "userPassword": "string"
    }
    */
    login: async (req, res) => {
        const { userEmail, userPassword } = req.body;
        if (!validateEmail(userEmail)) {
            const response = setResponseBadRequest(
                "Email is not found or invalid",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        if (!validatePassword(userPassword)) {
            const response = setResponseBadRequest(
                "Password is not found or invalid",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        try {
            const response = await authModule.login(userEmail, userPassword);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "authController:login", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    /*
    Signup request body
    {
        "userEmail": "string",
        "userPassword": "string",
        "userName": "string",
        "rollNumber": "string",
        "phoneNumber": "string",
        "collegeName": "string",
        "collegeCity": "string",
        "userDepartment": "string",
        "academicYear": number,
        "degree": "string",
        "needAccommodationDay1" : "boolean",
        "needAccommodationDay2" : "boolean",
        "needAccommodationDay3" : "boolean",
        "isAmrita" : "boolean"
    }
  */
    signup: async (req, res) => {
        const {
            userEmail,
            userPassword,
            userName,
            rollNumber,
            phoneNumber,
            collegeName,
            collegeCity,
            userDepartment,
            academicYear,
            degree,
            isAmrita,
            needAccommodationDay1,
            needAccommodationDay2,
            needAccommodationDay3,
        } = req.body;
        // Validate input data
        const validationErrors = validateSignupData(req.body);
        if (validationErrors != null) {
            const response = setResponseBadRequest(validationErrors);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await authModule.signup({
                userEmail,
                userPassword,
                userName,
                rollNumber,
                phoneNumber,
                collegeName,
                collegeCity,
                userDepartment,
                academicYear,
                degree,
                isAmrita,
                needAccommodationDay1,
                needAccommodationDay2,
                needAccommodationDay3,
            });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "authController:signup", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    /*
    Request Header: Bearer OTP Token
    Verify User Request Body
    {
      "otp": "string"
    }
  */
    verifyUser: async (req, res) => {
        const { otp, userID } = req.body;
        if (!validateOTP(otp)) {
            const response = setResponseBadRequest("Invalid OTP");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await authModule.verifyUser(userID, otp);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "authController : Account Verification", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    /*
    Forgot Password request body
    {
        "userEmail": "string"
    }
  */
    forgotPassword: async (req, res) => {
        const { userEmail } = req.body;
        if (!validateEmail(userEmail)) {
            const response = setResponseBadRequest(
                "Email is not found or Invalid",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await authModule.forgotPassword(userEmail);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "authController:Forgot Password", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    /*
    Request Header: Bearer OTP Token
    {
      "otp": "string",
      "userPassword": "string"
    }
  */
    resetPassword: async (req, res) => {
        const { otp, userPassword, userID } = req.body;

        if (!validatePassword(userPassword)) {
            const response = setResponseBadRequest("Invalid Password");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        if (!validateOTP(otp)) {
            const response = setResponseBadRequest("Invalid OTP");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await authModule.resetPassword(
                userID,
                otp,
                userPassword,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "authController : Reset Password", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    reVerifyUser: async (req, res) => {
        const { userEmail } = req.body;
        if (!validateEmail(userEmail)) {
            const response = setResponseBadRequest("Invalid email format");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        try {
            const response = await authModule.reVerifyUser(userEmail);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "authController:reVerifyUser", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default authController;
