import validator from "validator";
import { validateBasicString } from "./common.js";

const validateAddEventData = (eventData) => {
    if (!validateBasicString(eventData.eventName)) {
        return "Invalid event name";
    }
    if (
        !validateBasicString(eventData.imageUrl) ||
        !validator.isURL(eventData.imageUrl)
    ) {
        return "Invalid image url";
    }
    if (
        typeof eventData.eventFee != "number" ||
        eventData.eventFee === null ||
        eventData.eventFee < 0
    ) {
        return "Invalid event fee";
    }
    if (!validateBasicString(eventData.eventDescription, 5000)) {
        return "Invalid description of event";
    }
    if (!validateBasicString(eventData.eventDescSmall, 1000)) {
        return "Invalid short description of event";
    }
    if (
        eventData.isGroup === null ||
        typeof eventData.isGroup != "boolean" ||
        (eventData.isGroup !== false && eventData.isGroup !== true)
    ) {
        return "Invalid type or value for isGroup";
    }
    if (eventData.isGroup === true) {
        if (
            typeof eventData.maxTeamSize != "number" ||
            eventData.maxTeamSize === null ||
            typeof eventData.minTeamSize != "number" ||
            eventData.minTeamSize === null ||
            eventData.minTeamSize > eventData.maxTeamSize ||
            eventData.minTeamSize < 1 ||
            eventData.maxTeamSize < 1
        ) {
            return "Invalid input for team size!";
        }
    }
    if (!validateBasicString(eventData.eventDate, 1)) {
        return "Invalid event date";
    }
    if (
        typeof eventData.maxRegistrations != "number" ||
        eventData.maxRegistrations === null ||
        eventData.maxRegistrations < 0
    ) {
        return "Invalid max registration count";
    }
    if (
        eventData.isPerHeadFee === null ||
        typeof eventData.isPerHeadFee != "boolean" ||
        (eventData.isPerHeadFee !== false && eventData.isPerHeadFee !== true)
    ) {
        return "Incorrect type for isPerHeadFee";
    }
    if (!validateBasicString(eventData.godName, 50)) {
        return "Invalid god name";
    }
    if (
        !Array.isArray(eventData.tagIDs) ||
        eventData.tagIDs.length === 0 ||
        !eventData.tagIDs.every(
            (tag) => typeof tag === "number" && Number.isInteger(tag),
        )
    ) {
        return "Empty tag list or invalid entries";
    }
    if (
        !Array.isArray(eventData.organizerIDs) ||
        eventData.organizerIDs.length === 0 ||
        !eventData.organizerIDs.every(
            (org) => typeof org === "number" && Number.isInteger(org),
        )
    ) {
        return "Empty organizer list or invalid entries";
    }
    if (typeof eventData.clubID != "number" || eventData.clubID === null) {
        return "Invalid or empty club ID";
    }
    return null;
};

export { validateAddEventData };
