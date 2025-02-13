import { validateEmail } from "./auth.js";

const validateEventRegistration = (userID, eventID, totalMembers, teamName) => {
    if (
        !(
            typeof eventID === "number" &&
            eventID >= 1 &&
            typeof userID === "number" &&
            userID >= 1 &&
            typeof totalMembers === "number" &&
            totalMembers >= 1 &&
            typeof teamName === "string" &&
            teamName.length > 0 &&
            teamName.length < 255
        )
    ) {
        return false;
    }
    return true;
};

const validateEventGroup = (
    userEmail,
    teamMembers,
    memberRoles,
    totalMembers,
) => {
    if (
        !(
            typeof teamMembers === "object" &&
            teamMembers.length === totalMembers - 1 &&
            Array.isArray(teamMembers)
        )
    ) {
        return "Failed to Register. Team Data Invalid";
    }

    if (
        !(
            typeof memberRoles === "object" &&
            memberRoles.length === totalMembers - 1 &&
            Array.isArray(memberRoles)
        )
    ) {
        return "Failed to Register. Team Members Role Data Invalid";
    }

    var seenUsers = {};
    seenUsers[userEmail] = true;

    for (let i = 0; i <= teamMembers.length - 1; i++) {
        if (!validateEmail(teamMembers[i])) {
            return "Failed to Register. Invalid Team Member Email";
        }

        if (
            typeof memberRoles[i] !== "string" ||
            memberRoles[i].length === 0 ||
            memberRoles[i].length >= 255
        ) {
            return "Failed to Register. Invalid Team Member Role";
        }

        if (seenUsers[teamMembers[i]] === true) {
            return "Failed to Register. Duplicate Team Member Data Found !";
        }

        seenUsers[teamMembers[i]] = true;
    }
    return null;
};

export { validateEventRegistration, validateEventGroup };
