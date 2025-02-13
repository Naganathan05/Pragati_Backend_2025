import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { appConfig } from "../../config/config.js";

export default function (req, res, next) {
    const tokenHeader = req.headers.authorization;
    const webToken = tokenHeader && tokenHeader.split(" ")[1];
    if (tokenHeader == null || webToken == null) {
        req.body.isLoggedIn = 0;
        next();
        return;
    }
    const publicKey = readFileSync(
        "middleware/encryptionKeys/publicKey.pem",
        "utf8",
    );
    try {
        const payloadData = jwt.verify(webToken, publicKey, {
            algorithms: ["RS256"],
        });
        if (payloadData["SECRET_TOKEN"] == appConfig.tokenSecretKey) {
            req.body.isLoggedIn = 1;
            req.body.userEmail = payloadData["userEmail"];
            req.body.userID = payloadData["userID"];
        } else {
            req.body.isLoggedIn = 0;
            req.body.userID = -1; // it is set as -1 here to avoid unecessary validations in modules or controllers
        }
        next();
        return;
    } catch (err) {
        console.log(err);
        return res.status(401).send({ MESSAGE: "Unauthorized Access" });
    }
}
