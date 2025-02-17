/*
  =========================================================================== 
  Database Overview
  =========================================================================== 
  Purpose:
    This database is designed to store information about financial transactions 
    related to events in the Pragati application. It tracks details about the 
    user, the associated event, the transaction amount, and its status. 
      
  Engine and Encoding:
    - Engine: InnoDB is used to support foreign key constraints and transactions.
    - Charset: utf8mb4 ensures wide Unicode compatibility for user names, emails, 
      and other text fields.

  Notes:
    - Proper indexing on `userID`, `eventID`, and `transactionStatus` is crucial 
      for performance when filtering or joining this table in queries.
  ===========================================================================
*/


-- Table for transaction data ----------------------------------------------------------------------

DROP TABLE IF EXISTS `transactionData`;
CREATE TABLE IF NOT EXISTS `transactionData` (
  `transactionID` INT AUTO_INCREMENT PRIMARY KEY,
  `txnID` VARCHAR(255) NOT NULL UNIQUE,
  `mihpayuid` VARCHAR(255),
  `userID` INT NOT NULL,
  `eventID` INT NOT NULL,
  `amount` INT NOT NULL,
  `userEmail` VARCHAR(255) NOT NULL, 
  `userName` VARCHAR(255) NOT NULL,
  `phoneNumber` VARCHAR(15) NOT NULL,
  `transactionStatus` CHAR(1) NOT NULL CHECK(`transactionStatus` IN ('0','1','2')),  -- '0':Failed  '1':Pending  '2':Complete
  `productInfo` VARCHAR(5000) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `expiryTime` TIMESTAMP NOT NULL DEFAULT ( createdAt + INTERVAL 15 MINUTE ),
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO `transactionData` (`txnID`, `userID`, `eventID`, `amount`, `userEmail`, `userName`, `phoneNumber`, `transactionStatus`, `productInfo`)
VALUES ('TXN001', '2', '1', '500', 'naganathan1555@gmail.com', 'Naganathan', '1234567895', '2', 'EGRI-2-1-1-500');