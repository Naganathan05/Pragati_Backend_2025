import otpGenerator from "otp-generator";

export const generateOTP = () => {
    return otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
    });
};
