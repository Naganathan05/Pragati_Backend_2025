import { validateEmail } from "./auth.js";

export const validateMassMails = (emailIDs) => {
    for (const email of emailIDs) {
        if (!validateEmail(email)) {
            return false;
        }
    }
    return true;
};
