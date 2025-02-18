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
    if (!validateBasicString(eventData.venue, 1000)) {
        return "Invalid venue format for event";
    }
    if (!validateBasicString(eventData.time, 5000)) {
        return "Invalid time of event (should be sent as string)";
    }
    if (typeof eventData.rules != "string") {
        if (eventData.rules != null) {
            return "Invalid rules for event (should be string)";
        }
    }
    if (!validateBasicString(eventData.firstPrice, 255)) {
        if (eventData.firstPrice != null) {
            return "Invalid first price entry for event (should be sent as string)";
        }
    }
    if (!validateBasicString(eventData.secondPrice, 255)) {
        if (eventData.secondPrice != null) {
            return "Invalid second price entry for event (should be sent as string)";
        }
    }
    if (!validateBasicString(eventData.thirdPrice, 255)) {
        if (eventData.thirdPrice != null) {
            return "Invalid third price entry for event (should be sent as string)";
        }
    }
    if (!validateBasicString(eventData.fourthPrice, 255)) {
        if (eventData.fourthPrice != null) {
            return "Invalid fourth price entry for event (should be sent as string)";
        }
    }
    if (!validateBasicString(eventData.fifthPrice, 255)) {
        if (eventData.fifthPrice != null) {
            return "Invalid fifth price entry for event (should be sent as string)";
        }
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
