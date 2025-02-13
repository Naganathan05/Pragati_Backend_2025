import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { appConfig } from "../../config/config.js";

// the type of tokenValidator can be `OTP` or `JWT`
export const tokenValidator = (type) => {
    let secretKey;
    if (type == "JWT") {
        secretKey = appConfig.tokenSecretKey;
    } else if (type == "OTP") {
        secretKey = appConfig.otpTokenSecretKey;
    }
    return (req, res, next) => {
        const tokenHeader = req.headers.authorization;
        const webToken = tokenHeader && tokenHeader.split(" ")[1];

        // TODO: Have to add a validator for the Web Token.

        if (tokenHeader == null || webToken == null) {
            return res.status(401).send({
                MESSAGE: "No Token. Unauthorized Access.",
            });
        }

        const publicKey = readFileSync(
            "middleware/encryptionKeys/publicKey.pem",
            "utf8",
        );
        try {
            const payloadData = jwt.verify(webToken, publicKey, {
                algorithms: ["RS256"],
            });
            if (payloadData["SECRET_TOKEN"] == secretKey) {
                req.body.userEmail = payloadData["userEmail"];
                req.body.userID = payloadData["userID"];
                // roleID is set into the payload only while loggin in.
                // This can be used to verify the admin or super user privileges
                if (payloadData["roleID"]) {
                    req.body.roleID = payloadData["roleID"];
                }
                next();
                return;
            } else {
                return res.status(401).send({
                    MESSAGE: "Unauthorized Access.",
                });
            }
        } catch (error) {
            return res.status(401).send({
                MESSAGE: "Unauthorized Access",
            });
        }
    };
};
