import validator from "validator";

const validatePhoneNumber = (phoneNumber) => {
    return (
        typeof phoneNumber === "string" &&
        validator.isMobilePhone(phoneNumber, "en-IN")
    );
};

// Function to  validate standard MySQL VARCHAR(255)
const validateBasicString = (string, len = 255) => {
    return (
        typeof string == "string" &&
        string !== null &&
        validator.isLength(string.trim(), { min: 1, max: len })
    );
};

// Id will be passed as a string when passed via query params
const isValidID = (ID) => {
    return Number.isInteger(parseInt(ID)) && ID > 0;
};

export { validatePhoneNumber, validateBasicString, isValidID };
