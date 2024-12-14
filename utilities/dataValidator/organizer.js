import { validatePhoneNumber } from "./common.js";

// Validate organizer ID 
const validateOrganizerID = (organizerID) => {
  return Number.isInteger(organizerID) && organizerID > 0;
};

// Validate organizer name
const validateOrganizerName = (organizerName) => {
  return (typeof organizerName === "string") && organizerName.length > 0;
};


// Function to validate organizer data
const validateOrganizerData = (data) => {
  if (!validateOrganizerID(data.organizerID)) {
    return "Invalid or missing organizer ID."
  }

  if (!validateOrganizerName(data.organizerName)) {
    return "Invalid or missing organizer name.";
  }

  if (!validatePhoneNumber(data.phoneNumber)) {
    return "Invalid or missing organizer phone number.";
  }
};

export { validateOrganizerData };