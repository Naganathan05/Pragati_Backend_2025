import { convertDate } from "../mapDate.js";
import { setResponseBadRequest, setResponseOk } from "../response.js";

const checkEventExistence = async function (eventID, totalMembers, db) {
    try {
        await db.query("LOCK TABLE eventData READ");
        const [eventExists] = await db.query(
            "SELECT * FROM eventData WHERE eventID = ?",
            [eventID],
        );

        await db.query("UNLOCK TABLES");

        if (eventExists.length === 0) {
            return setResponseBadRequest("Event Not Found");
        }

        const convertedDate = convertDate(eventExists[0].eventDate);
        const currDate = new Date();
        const formattedToday = currDate.toISOString().split("T")[0];

        if (convertedDate <= formattedToday) {
            return setResponseBadRequest("Event has Completed !");
        }

        if (!(eventExists[0].eventStatus === "1")) {
            return setResponseBadRequest(
                "Registration Currently Closed for this Event !",
            );
        }

        if (eventExists[0].isGroup === 0 && totalMembers > 1) {
            return setResponseBadRequest(
                "Received more than One User to Register for a Non Group Event !",
            );
        }

        if (
            eventExists[0].minTeamSize > totalMembers ||
            eventExists[0].maxTeamSize < totalMembers
        ) {
            return setResponseBadRequest("Invalid Team Size !");
        }

        let numRemainingSeats =
            eventExists[0].maxRegistrations - eventExists[0].numRegistrations;
        if (numRemainingSeats < totalMembers) {
            return setResponseBadRequest("Registration Closed ! Seats Full.");
        }

        return setResponseOk("Event Exists", eventExists);
    } catch (error) {
        console.error("[ERROR]: Error in checkEventExistence Utility: ", error);
        throw new Error("Database Query Failed.");
    }
};

const checkDuplicateTransaction = async function (txnID, transactionDB) {
    try {
        await transactionDB.query("LOCK TABLES transactionData READ;");
        const [txnData] = await transactionDB.query(
            "SELECT * FROM transactionData WHERE txnID = ?",
            [txnID],
        );

        await transactionDB.query("UNLOCK TABLES");

        if (txnData.length > 0) {
            return setResponseBadRequest("Duplicate Transaction Attempt !");
        }

        return setResponseOk("Transaction Does not Exist");
    } catch (error) {
        console.log(
            "[ERROR]: Error in checkDuplicateTransaction Module",
            error,
        );
        throw new Error("Database Query Failed");
    }
};

export { checkEventExistence, checkDuplicateTransaction };
