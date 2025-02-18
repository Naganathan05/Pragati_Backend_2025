import { validateEmail } from "./auth.js";
import {
    isValidID,
    validateBasicString,
    validatePhoneNumber,
} from "./common.js";

const validateProfileData = (userData) => {
    if (!isValidID(userData.userID)) {
        return "Invalid user ID given.";
    }
    if (userData.userName && !validateBasicString(userData.userName)) {
        return "Invalid user name.";
    }
    if (userData.rollNumber && !validateBasicString(userData.rollNumber)) {
        return "Invalid roll number.";
    }
    if (userData.phoneNumber && !validatePhoneNumber(userData.phoneNumber)) {
        return "Invalid phone number.";
    }
    if (userData.collegeName && !validateBasicString(userData.collegeName)) {
        return "Invalid college name.";
    }
    if (userData.collegeCity && !validateBasicString(userData.collegeCity)) {
        return "Invalid college city.";
    }
    if (
        userData.userDepartment &&
        !validateBasicString(userData.userDepartment)
    ) {
        return "Invalid user department.";
    }
    if (
        userData.academicYear &&
        (typeof userData.academicYear !== "number" ||
            userData.academicYear <= 0)
    ) {
        return "Invalid academic year. It must be a positive number.";
    }
    if (userData.degree && !validateBasicString(userData.degree)) {
        return "Invalid degree.";
    }
    if (
        userData.needAccommodationDay1 !== undefined &&
        (typeof userData.needAccommodationDay1 !== "number" ||
            ![0, 1].includes(userData.needAccommodationDay1))
    ) {
        return "Invalid value for needAccommodationDay1. It must be 0 or 1.";
    }
    if (
        userData.needAccommodationDay2 !== undefined &&
        (typeof userData.needAccommodationDay2 !== "number" ||
            ![0, 1].includes(userData.needAccommodationDay2))
    ) {
        return "Invalid value for needAccommodationDay2. It must be 0 or 1.";
    }
    if (
        userData.needAccommodationDay3 !== undefined &&
        (typeof userData.needAccommodationDay3 !== "number" ||
            ![0, 1].includes(userData.needAccommodationDay3))
    ) {
        return "Invalid value for needAccommodationDay3. It must be 0 or 1.";
    }
    if (
        userData.isAmrita !== undefined &&
        (typeof userData.isAmrita !== "number" ||
            ![0, 1].includes(userData.isAmrita))
    ) {
        return "Invalid value for isAmrita. It must be 0 or 1.";
    }

    return null;
};

export { validateProfileData };
