import { validateBasicString } from "./common.js";

// Validator function for tag data
const validateTagData = (data) => {
    if (!data) {
        return "Tag data is missing.";
    }

    if (!validateBasicString(data.tagName, 255)) {
        return "Invalid tagName. It must be a non-empty string and cannot exceed 255 characters.";
    }

    if (!validateBasicString(data.tagAbbrevation, 10)) {
        return "Invalid tagAbbrevation. It must be a non-empty string and cannot exceed 10 characters.";
    }

    return null;
};

// Validator function for tag ID
const validateTagId = (id) => {
    if (!id) {
        return "Tag ID is required.";
    }

    if (isNaN(id)) {
        return "Tag ID must be a valid number.";
    }

    return null;
};

export { validateTagData, validateTagId };
