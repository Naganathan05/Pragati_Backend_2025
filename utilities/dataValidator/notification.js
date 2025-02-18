import validator from "validator";
import { isValidID, validateBasicString } from "./common.js";

const validateAddNotificationData = (data) => {
    if (!validateBasicString(data.title, 500)) {
        return "Invalid title for notification";
    }
    if (!validateBasicString(data.description, 2000)) {
        return "Invalid description for notification";
    }
    if (!validateBasicString(data.author, 255)) {
        return "Invalid author name";
    }
    if (!validateBasicString(data.venue, 500)) {
        return "Invalid venue";
    }

    if (!data.startDate) return "Invalid start date.";

    let date = new Date(data.startDate);
    const startDateValidity =
        !isNaN(date.getTime()) &&
        data.startDate === date.toISOString().split("T")[0];

    if (!startDateValidity) return "Invalid Start Date";

    if (!data.endDate) return "Invalid End date.";

    date = new Date(data.endDate);
    const endDateValidity =
        !isNaN(date.getTime()) &&
        data.endDate === date.toISOString().split("T")[0];

    if (!endDateValidity) return "Invalid End Date";
    return null;
};

const validateUpdateNotificationData = (data) => {
    if (!isValidID(data.notificationID)) {
        return "Invalid notification ID";
    }
    const errors = validateAddNotificationData(data);
    if (errors != null) {
        return errors;
    }
    return null;
};

export { validateAddNotificationData, validateUpdateNotificationData };
