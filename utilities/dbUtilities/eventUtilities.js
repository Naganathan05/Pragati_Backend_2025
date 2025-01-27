// function to generate query for all get functions.
/*
data = {
eventID : 1,
userID : 2,
...
}
NOTE: the key should match the column to search in database.
*/
// IMPORTANT: This function embeds the query with variable values too. So it will not be necessary to do,
//            db.query(thisQuery, [someValue,...]); The array is not necessary

const getEventQueryFormatter = function (
    isLoggedIn = 0,
    userID = -1,
    data = {},
) {
    // variable to avoid adding AND keyword in query for the first contition
    let firstCondition = true;
    let query = `SELECT
    e.eventID,
    e.eventName,
    e.eventDate,
    e.eventDescription,
    e.eventDescSmall,
    e.eventFee,
    e.isGroup,
    e.maxTeamSize,
    e.minTeamSize,
    e.eventStatus,
    e.numRegistrations,
    e.maxRegistrations,
    e.isPerHeadFee,
    e.imageUrl AS eventImageUrl,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'organizerID', o.organizerID,
                'organizerName', o.organizerName,
                'organizerPhoneNumber', o.phoneNumber
            )
        )
        FROM organizerEventMapping oem
        JOIN organizerData o ON oem.organizerID = o.organizerID
        WHERE oem.eventID = e.eventID
    ) AS organizers,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'tagID', t.tagID,
                'tagName', t.tagName,
                'tagAbbrevation', t.tagAbbrevation
            )
        )
        FROM tagEventMapping tem
        JOIN tagData t ON tem.tagID = t.tagID
        WHERE tem.eventID = e.eventID
    ) AS tags,

    c.clubID,
    c.clubName,
    c.imageUrl AS clubImageUrl,
    c.clubHead,
    c.clubAbbrevation,
    c.godName,
    CASE 
      WHEN ${isLoggedIn} = 1 AND 
      g.userID = ${userID} AND 
      rg.registrationStatus = '2'
      THEN '1' 
      ELSE '0'
    END AS isRegistered
    FROM
      eventData e
    LEFT JOIN
      clubEventMapping cem ON e.eventID = cem.eventID
    LEFT JOIN
      clubData c ON cem.clubID = c.clubID
    LEFT JOIN 
      registrationData rg ON rg.eventID = e.eventID
    LEFT JOIN 
      groupDetail g ON g.registrationID = rg.registrationID`;
    const groupByPart = ` GROUP BY
    e.eventID, e.eventName, e.eventDate, e.eventDescription, e.eventFee, e.imageUrl,
    c.clubID, c.clubName, c.imageUrl, c.clubHead, c.clubAbbrevation, c.godName`;
    if (data == {}) {
        return query + groupByPart;
    }
    Object.entries(data).map((condition) => {
        if (firstCondition === true) {
            if (condition[0] == "eventIDs") {
                query += ` WHERE e.eventID IN (${condition[1]})`;
            } else
                query += ` WHERE ${condition[0][0]}.${condition[0]} = ${condition[1]}`;
            firstCondition = false;
        } else {
            if (condition[0] == "eventIDs") {
                query += ` WHERE e.eventID IN ${condition[1]}`;
            } else
                query += ` AND ${condition[0][0]}.${condition[0]} = ${condition[1]}`;
        }
    });
    return query + groupByPart;
};

export { getEventQueryFormatter };
