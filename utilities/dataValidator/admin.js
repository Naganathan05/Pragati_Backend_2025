import { validateBasicString } from "./common.js";

const validateEditUserStatusData = (studentID, accountStatus) => {
    if (!studentID || !accountStatus) {
        return "studentID or accountStatus body is missing.";
    }

    if (isNaN(studentID)) {
        return "User ID must be a valid number.";
    }

    // Check accountStatus
    if (!["0", "1", "2"].includes(accountStatus)) {
        return "Invalid accountStatus. Must be '0', '1', or '2'.";
    }

    return null; // No errors
};

const validateEditUserRoleData = (studentID, roleID) => {
    if (!studentID || !roleID) {
        return "studentID or roleID body is missing.";
    }
    if (isNaN(studentID)) {
        return "User ID must be a valid number.";
    }
    if (isNaN(roleID)) {
        return "Role ID must be a valid number.";
    }
    if (![1, 2].includes(Number(roleID))) {
        return "Invalid roleID. Must be 1 or 2.";
    }

    return null; // No errors
};

export const validateNewUserRoleData = (roleID, roleName) => {
    if (!roleID || !roleName) {
        return "roleID or roleName body is missing";
    }
    if (isNaN(roleID)) {
        return "roleID must be a valid number.";
    }
    // Validate roleName
    if (!validateBasicString(roleName, 50)) {
        return "roleName must be a valid string.";
    }

    return null; // No errors
};

export { validateEditUserStatusData, validateEditUserRoleData };
