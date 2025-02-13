import { validateBasicString } from "./common.js";
import validator from "validator";

// Validate club data
const validateClubData = (data) => {
    if (!validateBasicString(data.clubName, 255))
        return "Invalid or missing club name.";
    if (
        !validateBasicString(data.imageUrl, 255) ||
        !validator.isURL(data.imageUrl)
    )
        return "Invalid or missing image URL.";
    if (!validateBasicString(data.clubHead, 255))
        return "Invalid or missing club head.";
    if (!validateBasicString(data.clubAbbrevation, 50))
        return "Invalid or missing club abbreviation."; // Assuming abbreviation max length is 50
    if (!validateBasicString(data.godName, 255))
        return "Invalid or missing god name.";
    return null; // No validation errors
};

// Validate club ID
const validateClubID = (clubID) => {
    if (!validator.isInt(String(clubID), { min: 1 })) return "Invalid club ID."; // Ensures it's a positive integer
    return null;
};

export { validateClubData, validateClubID };
