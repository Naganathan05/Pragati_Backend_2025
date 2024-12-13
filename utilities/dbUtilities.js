import {
  setResponseBadRequest,
  setResponseOk
} from "./response.js";
import { convertDate } from "./dateMapping.js";

// Check if a user exists by email
const isUserExistsByEmail = async function (email,db) {
  try {
    await db.query("LOCK TABLES userData READ");
    const [result] = await db.query(
      "SELECT * FROM userData WHERE userEmail = ?",
      [email]
    );
    await db.query("UNLOCK TABLES");
    return result.length > 0 ? result : null;
  } catch (err) {
    console.error("[ERROR]: Error in isUserExistsByEmail: ", err);
    throw new Error("Database query failed.");
  } finally {
    await db.query("UNLOCK TABLES");
    db.release();
  }
};


/*
  Response Codes:
  responseCode = 401 -> User Not Found || Account Blocked by Admin,
  responseCode = 403 -> User not Verified,
  responseCode = 200 -> User Exists and Account is Active.
*/
const checkValidUser = async function(userEmail, db, category, userID){
  const response = {
    responseCode: 200,
    responseBody: "User Data Fetched",
    responseData: null
  };

  try {
    let userData = null;
    if(category === "userEmail") userData = await isUserExistsByEmail(userEmail, db);
    else if(category === "userID") userData = await isUserExistsByUserID(userID, db);
    if(userData == null){
      response.responseCode = 401;
      response.responseBody = "User Not Found";
      return response;
    }

    if(userData[0].accountStatus === '0'){
      response.responseCode = 401;
      response.responseBody = "Account Blocked by Admin !";
      return response;
    } else if(userData[0].accountStatus === '1'){
      response.responseCode = 403;
      response.responseBody = "Account Not Verified";
      return response;
    }

    response.responseData = userData;
    return response;
  } catch (error) {
    console.error("[ERROR]: Error in checkValidUser Utility: ", error);
    throw new Error("Database query failed.");
  }
};

// Check if a user exists by userID
const isUserExistsByUserID = async function (userID,db) {
  try {
    await db.query("LOCK TABLES userData READ");
    const [result] = await db.query(
      "SELECT * FROM userData WHERE userID = ?",
      [userID]
    );
    await db.query("UNLOCK TABLES");
    return result.length > 0 ? result : null;
  } catch (err) {
    console.error("[ERROR]: Error in isUserExistsByUserID: ", err);
    throw new Error("Database query failed.");
  } finally {
    await db.query("UNLOCK TABLES");
    db.release();
  }
};

const checkEventExistence = async function (eventID, totalMembers, db) {
  try {
    await db.query("LOCK TABLE eventData READ");
    const [eventExists] = await db.query(
      "SELECT * FROM eventData WHERE eventID = ?",
      [eventID]
    );

    await db.query("UNLOCK TABLES");
    
    if(eventExists.length === 0){
      return setResponseBadRequest("Event Not Found");
    }

    const convertedDate = convertDate(eventExists[0].eventDate);
    const currDate = new Date();
    const formattedToday = currDate.toISOString().split('T')[0];

    if(convertedDate <= formattedToday) {
      return setResponseBadRequest("Event has Completed !");
    }

    if(!(eventExists[0].eventStatus === '1')) {
      return setResponseBadRequest("Registration Currently Closed for this Event !");
    }
    
    if(eventExists[0].minTeamSize > totalMembers || eventExists[0].maxTeamSize < totalMembers){
      return setResponseBadRequest("Invalid Team Size !");
    }

    let numRemainingSeats = eventExists[0].maxRegistrations - eventExists[0].numRegistrations;
    if(numRemainingSeats < totalMembers) {
      return setResponseBadRequest("Registration Closed ! Seats Full.");
    }

    return setResponseOk("Event Exists", eventExists);

  } catch (error) {
    console.error("[ERROR]: Error in checkEventExistence Utility: ", error);
    throw new Error("Database Query Failed.");
  } finally {
    db.release();
  }
};

const checkDuplicateTransaction = async function (txnID, transactionDB) {
  try {
    await transactionDB.query("LOCK TABLES transactionData READ;");
    const [txnData] = await transactionDB.query(
      "SELECT * FROM transactionData WHERE txnID = ?",
      [txnID]
    );

    await transactionDB.query("UNLOCK TABLES");

    if(txnData.length > 0) {
      return setResponseBadRequest("Duplicate Transaction Attempt !");
    }

    return setResponseOk("Transaction Does not Exist");
  } catch (error) {
    console.log("[ERROR]: Error in checkDuplicateTransaction Module", error);
    throw new Error("Database Query Failed");
  } finally {
    transactionDB.release();
  }
}

export { isUserExistsByEmail, isUserExistsByUserID, checkValidUser, checkEventExistence, checkDuplicateTransaction };
