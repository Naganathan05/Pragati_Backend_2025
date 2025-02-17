import { isUserExistsByEmail, isUserExistsByUserID } from "./common.js";
import { logError } from "../errorLogger.js";

/*
  Response Codes:
  responseCode = 401 -> User Not Found || Account Blocked by Admin,
  responseCode = 403 -> User not Verified,
  responseCode = 200 -> User Exists and Account is Active.
*/

const checkValidUser = async function (userEmail, db, category, userID) {
    const response = {
        responseCode: 200,
        responseBody: {
            MESSAGE: "",
            DATA: {},
        },
    };

    try {
        let userData = null;
        if (category === "userEmail")
            userData = await isUserExistsByEmail(userEmail, db);
        else if (category === "userID")
            userData = await isUserExistsByUserID(userID, db);

        if (userData == null) {
            response.responseCode = 401;
            response.responseBody.MESSAGE = "User Not Found";
            return response;
        }

        if (userData[0].accountStatus === "0") {
            response.responseCode = 401;
            response.responseBody.MESSAGE = "Account Blocked by Admin !";
            return response;
        } else if (userData[0].accountStatus === "1") {
            response.responseCode = 403;
            response.responseBody.MESSAGE = "Account Not Verified";
            return response;
        }

        response.responseData = userData;
        return response;
    } catch (error) {
        logError(err, "checkValidUser", "db");
        throw new Error("Database query failed.");
    }
};

export { checkValidUser };
