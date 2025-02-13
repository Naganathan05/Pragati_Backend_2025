import validator from "validator";
import { validateBasicString } from "./common.js";

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
    if (!validator.isDate(data.startDate) || data.startDate === null) {
        return "Invalid start date.";
    }
    if (!validator.isDate(data.endDate) || data.endDate === null) {
        return "Invalid end date.";
    }
    return null;
};

export { validateAddNotificationData };
