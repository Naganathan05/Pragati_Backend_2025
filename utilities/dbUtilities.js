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

export { isUserExistsByEmail, isUserExistsByUserID, checkValidUser };
