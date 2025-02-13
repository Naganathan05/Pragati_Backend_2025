import crypto from "crypto";
import { appConfig } from "../config/config.js";

const key = appConfig.payUKey;
const salt = appConfig.payUSalt;

function generateHash(params) {
    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
    const hashString = `${key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${salt}`;

    // Generate the hash
    const hash = sha512(hashString);

    return hash;
}

function generateVerifyHash(params) {
    // sha512(key|command|var1|salt)
    const hashString = `${key}|${params.command}|${params.var1}|${salt}`;

    // Generate the hash
    const hash = sha512(hashString);

    return hash;
}

function sha512(str) {
    return crypto.createHash("sha512").update(str).digest("hex");
}

export { generateHash, generateVerifyHash };
