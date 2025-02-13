import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { appConfig } from "../config/config.js";

let secretKey = "";

export const createToken = (payloadData, category) => {
    // Category = OTP -> OTP Token Generator.
    // Category = User -> Login Token Generator.
    if (category == "OTP") secretKey = appConfig.otpTokenSecretKey;
    else secretKey = appConfig.tokenSecretKey;
    payloadData.SECRET_TOKEN = secretKey;
    const privateKey = readFileSync(
        "middleware/encryptionKeys/privateKey.pem",
        "utf8",
    );
    const webToken = jwt.sign(payloadData, privateKey, {
        algorithm: "RS256",
        expiresIn: "1d",
    });
    return webToken;
};
