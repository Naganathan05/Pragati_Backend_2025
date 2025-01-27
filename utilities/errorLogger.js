import { appendFileSync } from "fs";

const logError = (err, location, type) => {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: Occured at ${location} \n ${timeStamp} - ${err.message}`;
    if (type == "connection") {
        console.error(`[ERROR]: Occured at ${location} : \n ${err}`);
        appendFileSync(
            "./logs/connection/poolConnection.log",
            `${errMessage}\n`,
        );
    } else if (type == "db") {
        console.error(`[ERROR]: Occured at ${location} : \n ${err}`);
        appendFileSync("./logs/db/dbErrors.log", `${errMessage}\n`);
    } else if (type == "mailError") {
        console.error(`[ERROR]: Occured at ${location} : \n ${err}`);
        appendFileSync("./logs/mailer.log", `${errMessage}\n`);
    } else if (type == "mailLog") {
        console.error(`[LOG]: Occured at ${location} : \n ${err}`);
        const errMessage = `[LOG]: Occured at ${location} \n ${timeStamp} - ${err}`;
        appendFileSync("./logs/mailer.log", `${errMessage}\n`);
    }
};

export { logError };
