// Function to generate login payload with overrides
const generateLoginPayload = (overrides = {}) => ({
  userEmail: "thanuskumaara@gmail.com",
  userPassword: "Thanus2025",
  ...overrides,
});

export const loginTestCases = [
  {
      name: "Valid input - should log in successfully",
      payload: generateLoginPayload(),
      expectedStatus: 200,
      expectedMessage: "Login successful",
      expectedData: {
    },
  },
  {
      name: "Invalid email format - should return error",
      payload: generateLoginPayload({ userEmail: "invalidemail" }),
      expectedStatus: 400,
      expectedMessage: "Email is not found in request or invalid",
      expectedData: {},
  },
  {
      name: "Missing email - should return error",
      payload: generateLoginPayload({ userEmail: "" }),
      expectedStatus: 400,
      expectedMessage: "Email is not found in request or invalid",
      expectedData: {},
  },
  {
      name: "Invalid password format - should return error",
      payload: generateLoginPayload({ userPassword: "123" }),
      expectedStatus: 400,
      expectedMessage: "Password is not found or invalid",
      expectedData: {},
  },
  {
      name: "Missing password - should return error",
      payload: generateLoginPayload({ userPassword: "" }),
      expectedStatus: 400,
      expectedMessage: "Password is not found or invalid",
      expectedData: {},
  },
  {
      name: "Unregistered email - should return error",
      payload: generateLoginPayload({ userEmail: "notexist@gmail.com" }),
      expectedStatus: 401,
      expectedMessage: "Email is not found in request or invalid",
      expectedData: {},
  },
  {
      name: "Wrong password - should return error",
      payload: generateLoginPayload({ userPassword: "wrongPassword" }),
      expectedStatus: 400,
      expectedMessage: "Incorrect password for given user..",
      expectedData: {},
  },
];
