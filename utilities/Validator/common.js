import validator from "validator";

const validatePhoneNumber = (phoneNumber) => {
  return (
    typeof phoneNumber === "string" &&
    validator.isMobilePhone(phoneNumber, "en-IN")
  );
};

export { validatePhoneNumber };