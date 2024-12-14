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

export { isUserExistsByEmail, isUserExistsByUserID };
