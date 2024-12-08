import validator from "validator";

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
    password.length > 8 &&
    password.length <= 255 &&
    !validator.contains(password, "-" || "'")
  ) {
    return true;
  }
  return false;
};

const validatePhoneNumber = (phoneNumber) => {
  return typeof phoneNumber === "string" && validator.isMobilePhone(phoneNumber, 'en-IN');
};

// Function to validate academic year
const validateAcademicYear = (year) => {
  return Number.isInteger(year);
};

// Function to validate signup data
const validateSignupData = (data) => {

  if (!validateEmail(data.email)) {
    return "Invalid or missing email.";
  }

  if (!validatePassword(data.password)) {
    return "Invalid or missing password.";
  }

  if (typeof data.userName !== "string" || data.userName.trim().length === 0) {
    return "Invalid or missing userName.";
  }

  if (typeof data.rollNumber !== "string" || data.rollNumber.trim().length === 0) {
    return "Invalid or missing rollNumber.";
  }

  if (!validatePhoneNumber(data.phoneNumber)) {
    return "Invalid or missing phoneNumber.";
  }

  if (typeof data.collegeName !== "string" || data.collegeName.trim().length === 0) {
    return "Invalid or missing collegeName.";
  }

  if (typeof data.collegeCity !== "string" || data.collegeCity.trim().length === 0) {
    return "Invalid or missing collegeCity.";
  }

  if (typeof data.userDepartment !== "string" || data.userDepartment.trim().length === 0) {
    return "Invalid or missing userDepartment.";
  }

  if (!validateAcademicYear(data.academicYear)) {
    return "Invalid or missing academicYear.";
  }

  if (typeof data.degree !== "string" || data.degree.trim().length === 0) {
    return "Invalid or missing degree.";
  }

  // Validate isAmrita if provided
  if (typeof data.isAmrita !="boolean" && (data.isAmrita !=false || data.isAmrita != true)) {
    return "Invalid value for isAmrita.";
  }
  return null;
};

export { validateEmail, validatePassword, validateSignupData };
