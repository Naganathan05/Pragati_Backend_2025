import validator from "validator";
import { validatePhoneNumber } from "./common.js";

// function that validates email
const validateEmail = (email) => {
    if (
        typeof email == "string" &&
        email.length > 0 &&
        email.length <= 255 &&
        validator.isEmail(email)
    ) {
        return true;
    }
    return false;
};

// function that validates hashed password (64 bit hashing)
const validatePassword = (password) => {
    if (
        typeof password === "string" &&
        password != null &&
        password.length >= 8 &&
        password.length <= 255 &&
        !validator.contains(password, "-" || "'")
    ) {
        return true;
    }
    return false;
};

// Function that Validates OTP
const validateOTP = (otp) => {
    if (
        typeof otp === "string" &&
        otp != null &&
        otp.length > 0 &&
        otp.length <= 255
    ) {
        return true;
    }
    return false;
};

// Function to validate academic year
const validateAcademicYear = (year) => {
    return Number.isInteger(year);
};

// Function to validate signup data
const validateSignupData = (data) => {
    if (!validateEmail(data.userEmail)) {
        return "Invalid or missing email.";
    }

    if (!validatePassword(data.userPassword)) {
        return "Invalid or missing password.";
    }

    if (
        typeof data.userName !== "string" ||
        data.userName.trim().length === 0
    ) {
        return "Invalid or missing userName.";
    }

    if (
        typeof data.rollNumber !== "string" ||
        data.rollNumber.trim().length === 0
    ) {
        return "Invalid or missing rollNumber.";
    }

    if (!validatePhoneNumber(data.phoneNumber)) {
        return "Invalid or missing phoneNumber.";
    }

    if (
        typeof data.collegeName !== "string" ||
        data.collegeName.trim().length === 0
    ) {
        return "Invalid or missing collegeName.";
    }

    if (
        typeof data.collegeCity !== "string" ||
        data.collegeCity.trim().length === 0
    ) {
        return "Invalid or missing collegeCity.";
    }

    if (
        typeof data.userDepartment !== "string" ||
        data.userDepartment.trim().length === 0
    ) {
        return "Invalid or missing userDepartment.";
    }

    if (!validateAcademicYear(data.academicYear)) {
        return "Invalid or missing academicYear.";
    }

    if (typeof data.degree !== "string" || data.degree.trim().length === 0) {
        return "Invalid or missing degree.";
    }

    // Validate isAmrita if provided
    if (
        data.isAmrita === null ||
        typeof data.isAmrita != "boolean" ||
        (data.isAmrita != false && data.isAmrita != true)
    ) {
        return "Invalid isAmrita Value";
    }
    if (
        data.needAccommodationDay1 === null ||
        typeof data.needAccommodationDay1 != "boolean" ||
        (data.needAccommodationDay1 != false &&
            data.needAccommodationDay1 != true)
    ) {
        return "Invalid Accommodation Day 1 Value";
    }
    if (
        data.needAccommodationDay2 === null ||
        typeof data.needAccommodationDay2 != "boolean" ||
        (data.needAccommodationDay2 != false &&
            data.needAccommodationDay2 != true)
    ) {
        return "Invalid Accommodation Day 2 Value";
    }
    if (
        data.needAccommodationDay3 === null ||
        typeof data.needAccommodationDay3 != "boolean" ||
        (data.needAccommodationDay3 != false &&
            data.needAccommodationDay3 != true)
    ) {
        return "Invalid Accommodation Day 3 Value";
    }
    return null;
};

export { validateEmail, validatePassword, validateSignupData, validateOTP };
