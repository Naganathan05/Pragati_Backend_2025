import {
    setResponseOk,
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import { appendFileSync } from "fs";
import { pragatiDb, transactionsDb } from "../db/poolConnection.js";
import { checkValidUser } from "../utilities/dbUtilities/userUtilities.js";
import { generateHash } from "../utilities/payU.js";
import {
    checkDuplicateTransaction,
    checkEventExistence,
} from "../utilities/dbUtilities/registrationUtilities.js";
import { validateEventGroup } from "../utilities/dataValidator/registration.js";

const registrationModule = {
    addRegistration: async function (
        userID,
        eventID,
        totalMembers,
        teamName,
        teamMembers,
        memberRoles,
    ) {
        const db = await pragatiDb.promise().getConnection();
        const transactionDB = await transactionsDb.promise().getConnection();
        try {
            var transactionStarted = 0;

            // Check the Existence and Account Status of the User.
            const userCheckResponse = await checkValidUser(
                null,
                db,
                "userID",
                userID,
            );
            if (userCheckResponse.responseCode !== 200) {
                return setResponseBadRequest(userCheckResponse.responseBody);
            }

            const userData = userCheckResponse.responseData;

            await transactionDB.query("LOCK TABLES transactionData READ");

            // Checking for any pending payments from the user.
            const [pendingPayments] = await transactionDB.query(
                "SELECT * FROM transactionData WHERE userID = ? and transactionStatus = '1'",
                [userID],
            );

            if (pendingPayments.length > 0) {
                return setResponseBadRequest(
                    "You have already made an attempt to Register for an event that is still in pending state.",
                );
            }

            await transactionDB.query("UNLOCK TABLES");

            // Checking the Existence and Status and Seats Availaibility of the Event Which is Requested.
            const eventExistsResponse = await checkEventExistence(
                eventID,
                totalMembers,
                db,
            );
            if (eventExistsResponse.responseCode !== 200) {
                return eventExistsResponse;
            }

            const eventData = eventExistsResponse.responseBody.DATA;

            // Checking if the Users has already registered for the Event.
            await db.query("LOCK TABLES groupDetail READ;");
            const [eventGroupData] = await db.query(
                "SELECT * FROM groupDetail WHERE userID = ? AND eventID = ?",
                [userID, eventID],
            );

            if (eventGroupData.length > 0) {
                return setResponseBadRequest(
                    "You are already in a group for the same event or the registration is pending ! Complete it before trying another attempt",
                );
            }

            await db.query("UNLOCK TABLES");

            /*---------------------------------------------------------------------------------------
                                                PAYU PART BELOW                     
            -----------------------------------------------------------------------------------------*/

            const txnID = `TXN-${userID.toString()}-${eventID.toString()}-${new Date().getTime()}`;

            let paymentAmount = 0;
            let productInfo = "";
            let userName = userData[0].userName;
            let userEmail = userData[0].userEmail;
            let phoneNumber = userData[0].phoneNumber;

            // Individual Registration Event.
            if (eventData[0].isGroup === 0) {
                paymentAmount =
                    eventData[0].eventFee +
                    Math.ceil(eventData[0].eventFee * 0.18);
                productInfo = `ERI-${userID.toString()}-${eventID.toString()}-${totalMembers.toString()}-${paymentAmount.toString()}-${eventData[0].eventName.toString()}`;

                // Checking if the txnID is present in the Table.
                const checkDuplicateTransactionResponse =
                    await checkDuplicateTransaction(txnID, transactionDB);
                if (checkDuplicateTransactionResponse.responseCode !== 200) {
                    return checkDuplicateTransactionResponse;
                }

                await transactionDB.beginTransaction();
                await db.beginTransaction();
                // await transactionDB.query("LOCK TABLES transactionData WRITE;");

                transactionStarted = 1;

                // Insert into transactionData Table.
                const [insertTransactionRecord] = await transactionDB.query(
                    "INSERT INTO transactionData (txnID, userID, eventID, amount, userName, userEmail, phoneNumber, productInfo, transactionStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        txnID,
                        userID,
                        eventID,
                        paymentAmount,
                        userName,
                        userEmail,
                        phoneNumber,
                        productInfo,
                        "1",
                    ],
                );

                if (insertTransactionRecord.affectedRows !== 1) {
                    console.log(
                        "[ERROR]: Failed to Insert Record into transactionData",
                    );
                    const data = [
                        txnID,
                        userID,
                        eventID,
                        paymentAmount,
                        userName,
                        userEmail,
                        phoneNumber,
                        productInfo,
                    ];
                    console.log(data);
                    appendFileSync(
                        "./logs/failedRegistrations.log",
                        `${new Date().getTime}-"transactionData Table Insertion Failed"-${data}`,
                    );
                    throw new Error(
                        "Failed to Insert Record into transactionData Table",
                    );
                }

                // await db.query("LOCK TABLES registrationData WRITE;");

                // Insert into registrationData Table.
                const [insertRegistrationRecord] = await db.query(
                    "INSERT INTO registrationData (eventID, userID, txnID, amountPaid, totalMembers, teamName) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        eventID,
                        userID,
                        txnID,
                        paymentAmount,
                        totalMembers,
                        teamName,
                    ],
                );

                if (insertRegistrationRecord.affectedRows !== 1) {
                    console.log(
                        "[ERROR]: Failed to Insert Record into registrationData for Individual Registration",
                    );
                    const data = [
                        txnID,
                        userID,
                        eventID,
                        paymentAmount,
                        userName,
                        userEmail,
                        phoneNumber,
                        productInfo,
                    ];
                    console.log(data);
                    appendFileSync(
                        "./logs/failedRegistrations.log",
                        `${new Date().getTime}-"registrationData Table Insertion Failed"-${data}`,
                    );
                    throw new Error(
                        "Failed to Insert Record into registrationData Table",
                    );
                }

                const [insertGroupDetailRecord] = await db.query(
                    "INSERT INTO groupDetail (registrationID, userID, eventID) VALUES (?, ?, ?)",
                    [insertRegistrationRecord.insertId, userID, eventID],
                );

                if (insertGroupDetailRecord.affectedRows !== 1) {
                    console.log(
                        "[ERROR]: Failed to Insert Record into groupDetail for Individual Registration",
                    );
                    const data = [
                        txnID,
                        userID,
                        eventID,
                        paymentAmount,
                        userName,
                        userEmail,
                        phoneNumber,
                        productInfo,
                    ];
                    console.log(data);
                    appendFileSync(
                        "./logs/failedRegistrations.log",
                        `${new Date().getTime}-"groupDetail Table Insertion Failed"-${data}`,
                    );
                    throw new Error(
                        "Failed to Insert Record into groupDetail Table",
                    );
                }

                // await db.query("LOCK TABLES eventData WRITE;");

                // Blocking the Requested Seats for the User.
                const [eventDataUpdate] = await db.query(
                    "UPDATE eventData SET numRegistrations = ? WHERE eventID = ?",
                    [eventData[0].numRegistrations + totalMembers, eventID],
                );

                if (eventDataUpdate.affectedRows !== 1) {
                    console.log(
                        "[ERROR]: Error in Inserting Udpating Seats in eventsData after Registration",
                    );
                    const data = [
                        eventData[0].numRegistrations + totalMembers,
                        eventID,
                    ];
                    console.log(data);
                    appendFileSync(
                        "./logs/failedRegistrations.log",
                        `${new Date().getTime}-"eventData Seats Update Failed"-${data}`,
                    );
                    throw new Error("eventData Seats Update Failed");
                }

                await transactionDB.commit();
                await db.commit();
                // await db.query("UNLOCK TABLES");

                const hashedData = generateHash({
                    txnid: txnID,
                    amount: paymentAmount.toString(),
                    productinfo: productInfo,
                    firstname: userName,
                    email: userEmail,
                });

                return setResponseOk("Proceed to Pay. Seat Blocked.", {
                    txnID: txnID,
                    amount: paymentAmount,
                    productInfo: productInfo,
                    userName: userName,
                    userEmail: userEmail,
                    phoneNumber: phoneNumber,
                    surl: ``, // TODO: Should Configure URL's for Redirection.
                    furl: ``,
                    hash: hashedData,
                });
            }
            // Group Event.
            else if (eventData[0].isGroup === 1) {
                if (eventData[0].isPerHeadFee === 1) {
                    paymentAmount =
                        eventData[0].eventFee * totalMembers +
                        Math.ceil(eventData[0].eventFee * totalMembers * 0.18);
                }

                if (eventData[0].isPerHeadFee === 0) {
                    paymentAmount =
                        eventData[0].eventFee +
                        Math.ceil(eventData[0].eventFee * 0.18);
                }

                productInfo = `EGRI-${userID.toString()}-${eventID.toString()}-${totalMembers.toString()}-${paymentAmount.toString()}`;

                // Validate Data: teamMembers, memberRoles.
                const validGroupData = validateEventGroup(
                    userEmail,
                    teamMembers,
                    memberRoles,
                    totalMembers,
                );
                if (validGroupData !== null) {
                    return setResponseBadRequest(validGroupData);
                }

                // await db.query("LOCK TABLES userData READ, registrationData READ, groupDetail READ");

                // Accumulating the userID's of the Email's present in teamMembers.
                const [userTeamDataCheck] = await db.query(
                    "SELECT * FROM userData WHERE accountStatus = '2' AND userEmail IN (?)",
                    [teamMembers],
                );

                if (userTeamDataCheck.length !== teamMembers.length) {
                    return setResponseBadRequest(
                        "Failed to Register. Invalid Email, one of the Team Member Has not Registered for Pragati 2025.",
                    );
                }

                let userIDs = [];
                for (let i = 0; i < userTeamDataCheck.length; i++) {
                    userIDs.push(userTeamDataCheck[i].userID);
                }

                // Checking if any of the Team Member has already Registered for the Event.
                const [eventRegistrationGroupCheck] = await db.query(
                    "SELECT * FROM groupDetail WHERE eventID = ? AND userID IN (?)",
                    [eventID, userIDs],
                );

                if (eventRegistrationGroupCheck.length > 0) {
                    return setResponseBadRequest(
                        "Failed to Register. One of Teammates is already part of Another Team",
                    );
                }

                // await db.query("UNLOCK TABLES");

                // Checking if the txnID is UNIQUE.
                const checkDuplicateTransactionResponse =
                    await checkDuplicateTransaction(txnID, transactionDB);
                if (checkDuplicateTransactionResponse.responseCode !== 200) {
                    return checkDuplicateTransactionResponse;
                }

                await transactionDB.beginTransaction();
                await db.beginTransaction();
                // await transactionDB.query("LOCK TABLES transactionData WRITE;");

                transactionStarted = 1;

                // Insert into transactionData Table.
                const [insertTransactionRecord] = await transactionDB.query(
                    "INSERT INTO transactionData (txnID, userID, eventID, amount, userName, userEmail, phoneNumber, productInfo, transactionStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        txnID,
                        userID,
                        eventID,
                        paymentAmount,
                        userName,
                        userEmail,
                        phoneNumber,
                        productInfo,
                        "1",
                    ],
                );

                if (insertTransactionRecord.affectedRows !== 1) {
                    console.log(
                        "[ERROR]: Failed to Insert Record into transactionData",
                    );
                    const data = [
                        txnID,
                        userID,
                        eventID,
                        paymentAmount,
                        userName,
                        userEmail,
                        phoneNumber,
                        productInfo,
                    ];
                    console.log(data);
                    appendFileSync(
                        "./logs/failedRegistrations.log",
                        `${new Date().getTime}-"transactionData Table Insertion Failed"-${data}`,
                    );
                    throw new Error(
                        "Failed to Insert Record into transactionData Table",
                    );
                }

                // await db.query("LOCK TABLES registrationData WRITE;");

                // Insert into registrationData Table.
                const [insertRegistrationRecord] = await db.query(
                    "INSERT INTO registrationData (eventID, userID, txnID, amountPaid, totalMembers, teamName) VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        eventID,
                        userID,
                        txnID,
                        paymentAmount,
                        totalMembers,
                        teamName,
                    ],
                );

                if (insertRegistrationRecord.affectedRows !== 1) {
                    console.log(
                        "[ERROR]: Failed to Insert Record into registrationData",
                    );
                    const data = [
                        txnID,
                        userID,
                        eventID,
                        paymentAmount,
                        userName,
                        userEmail,
                        phoneNumber,
                        productInfo,
                    ];
                    console.log(data);
                    appendFileSync(
                        "./logs/failedRegistrations.log",
                        `${data}-${new Date().getTime}-"registrationData Table Insertion Failed"-${data}`,
                    );
                    throw new Error(
                        "Failed to Insert Record into registrationData Table",
                    );
                }

                // await db.query("LOCK TABLES groupDetail WRITE;");

                // Insert into groupDetail Table for the registering user as "TEAM LEAD".
                const [insertLeaderGroupData] = await db.query(
                    "INSERT INTO groupDetail (registrationID, userID, eventID, roleDescription) VALUES (?, ?, ?, ?)",
                    [
                        insertRegistrationRecord.insertId,
                        userID,
                        eventID,
                        "TEAM LEAD",
                    ],
                );

                if (insertLeaderGroupData.affectedRows !== 1) {
                    console.log(
                        "[ERROR]: Failed to Insert Record into groupDetail",
                    );
                    const data = [
                        insertRegistrationRecord.insertId,
                        userID,
                        eventID,
                        "TEAM LEAD",
                    ];
                    console.log(data);
                    appendFileSync(
                        "./logs/failedRegistrations.log",
                        `${new Date().getTime}-"registrationData Table Insertion Failed"-${data}`,
                    );
                    throw new Error(
                        "Failed to Insert Record into groupDetail Table",
                    );
                }

                // Insert all Team Members except the registering User as "TEAM MEMBER".
                for (let i = 0; i < teamMembers.length; i++) {
                    const [insertTeamGroupData] = await db.query(
                        "INSERT INTO groupDetail (registrationID, userID, eventID, roleDescription) VALUES (?, ?, ?, ?)",
                        [
                            insertRegistrationRecord.insertId,
                            userIDs[i],
                            eventID,
                            memberRoles[i],
                        ],
                    );

                    if (insertTeamGroupData.affectedRows !== 1) {
                        console.log(
                            "[ERROR]: Failed to Insert Record into groupDetail",
                        );
                        const data = [
                            insertRegistrationRecord.insertId,
                            userID,
                            eventID,
                            "TEAM LEAD",
                        ];
                        console.log(data);
                        appendFileSync(
                            "./logs/failedRegistrations.log",
                            `${data}-${new Date().getTime}-"registrationData Table Insertion Failed"-${data}`,
                        );
                        throw new Error(
                            "Failed to Insert Record into groupDetail Table",
                        );
                    }
                }

                // await db.query("LOCK TABLES eventData WRITE;");

                // Blocking the Requested Seats for the Team in the Event.
                const [eventDataUpdate] = await db.query(
                    "UPDATE eventData SET numRegistrations = ? WHERE eventID = ?",
                    [eventData[0].numRegistrations + totalMembers, eventID],
                );

                if (eventDataUpdate.affectedRows !== 1) {
                    console.log(
                        "[ERROR]: Error in Inserting Updating Seats in eventData after Registration",
                    );
                    const data = [
                        eventData[0].numRegistrations + totalMembers,
                        eventID,
                    ];
                    console.log(data);
                    appendFileSync(
                        "./logs/failedRegistrations.log",
                        `${data}-${new Date().getTime}-"eventData Seats Update Failed"-${data}`,
                    );
                    throw new Error("eventData Seats Update Failed");
                }

                await transactionDB.commit();
                await db.commit();
                // await db.query("UNLOCK TABLES");

                const hashedData = generateHash({
                    txnid: txnID,
                    amount: paymentAmount.toString(),
                    productinfo: productInfo,
                    firstname: userName,
                    email: userEmail,
                });

                return setResponseOk("Proceed to Pay. Seats Blocked.", {
                    txnID: txnID,
                    amount: paymentAmount,
                    productInfo: productInfo,
                    userName: userName,
                    userEmail: userEmail,
                    phoneNumber: phoneNumber,
                    surl: ``, // TODO: Should Configure URL's for Redirection.
                    furl: ``,
                    hash: hashedData,
                });
            }
        } catch (err) {
            if (transactionStarted === 1) {
                await db.rollback();
                await transactionDB.rollback();
            }

            console.log("[ERROR]: Error in Registration Module: ", err);
            appendFileSync(
                "./logs/controller/controllerErrors.log",
                `${new Date().getTime}-"Registration Module Failed"-${err}`,
            );
            return setResponseInternalError(err);
        } finally {
            await db.query("UNLOCK TABLES");
            await transactionDB.query("UNLOCK TABLES");

            db.release();
            transactionDB.release();
        }
    },
};

export default registrationModule;
