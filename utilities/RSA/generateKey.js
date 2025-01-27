import { writeFileSync, appendFileSync, mkdirSync, existsSync } from "fs";
import crypto from "crypto";

export const generateKey = async () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });

    try {
        // Create folder if not exists.
        if (!existsSync("./middleware/encryptionKeys")) {
            mkdirSync("./middleware/encryptionKeys");
        }

        writeFileSync("./middleware/encryptionKeys/privateKey.pem", privateKey);
        writeFileSync("./middleware/encryptionKeys/publicKey.pem", publicKey);
        console.log("[LOG]: RSA Encryption Keys Generated Succussfully");
    } catch (error) {
        console.log("[ERROR]: Error in Generating RSA Keys", error);
        appendFileSync(
            "./logs/server.log",
            `[${new Date().toLocaleString()}]: ${error}\n`,
        );
    }
};
