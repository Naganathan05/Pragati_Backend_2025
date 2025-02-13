import { validatePhoneNumber } from "./common.js";

// Validate organizer ID
const validateOrganizerID = (organizerID) => {
    return Number.isInteger(organizerID) && organizerID > 0;
};

// Validate organizer name
const validateOrganizerName = (organizerName) => {
    return typeof organizerName === "string" && organizerName.length > 0;
};

// Function to validate organizer data
const validateOrganizerData = (data) => {
    if (!validateOrganizerID(data.organizerID)) {
        return "Invalid or missing organizer ID.";
    }

    if (!validateOrganizerName(data.organizerName)) {
        return "Invalid or missing organizer name.";
    }

    if (!validatePhoneNumber(data.phoneNumber)) {
        return "Invalid or missing organizer phone number.";
    }
};

// Function to just check organizerID
const validateRemoveOrganizerData = (data) => {
    if (!data) {
        return "Organizer ID is required.";
    }

    if (typeof data !== "number" || data <= 0 || !Number.isInteger(data)) {
        return "Invalid organizer ID or must be a positive integer.";
    }

    return null;
};

// Function to validate the incoming data for an addOrganizer
const validateOrganizer = (organizerName, phoneNumber) => {
    if (!organizerName || !phoneNumber) {
        return "Both name and phone number are required";
    }

    if (!validatePhoneNumber(phoneNumber)) {
        return "Invalid Phone Number";
    }

    return null;
};

export {
    validateOrganizerData,
    validateRemoveOrganizerData,
    validateOrganizer,
};
