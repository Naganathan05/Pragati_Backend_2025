/*
  ===========================================================================
  Database Schema Overview
  ===========================================================================
  Purpose:
    This schema defines the structure for the Pragati database.
    It is designed to manage and store user information, roles, events, 
    registration details and other related data for the application. 
    The schema facilitates efficient data handling, role-based access control,
    and activity tracking.

  Key Features:
    - Normalized structure to minimize redundancy and optimize queries.
    - Foreign key constraints to ensure data integrity and enforce relationships.
    - Default values and constraints for consistent and valid data entry.
    - Support for transactional operations using the InnoDB engine.

  Engine and Encoding:
    - Engine: 
      1. InnoDB is used for all tables except one to support transactions and foreign keys.
      2. MEMORY is used for otpTable for temporary storage of data and faster access.
    - Charset: utf8mb4 for wide Unicode compatibility (e.g., emojis, special characters).

  Notes:
    - Ensure proper indexing of frequently queried columns to optimize performance.
    - Backup and replication strategies should be implemented for data safety.
  ===========================================================================
*/

DROP TABLE IF EXISTS `groupDetail`;
DROP TABLE IF EXISTS `registrationData`;
DROP TABLE IF EXISTS `otpTable`;
DROP TABLE IF EXISTS `userData`;
DROP TABLE IF EXISTS `userRole`;
DROP TABLE IF EXISTS `organizerEventMapping`;
DROP TABLE IF EXISTS `tagEventMapping`;
DROP TABLE IF EXISTS `clubEventMapping`;
DROP TABLE IF EXISTS `eventData`;
DROP TABLE IF EXISTS `organizerData`;
DROP TABLE IF EXISTS `tagData`;
DROP TABLE IF EXISTS `clubData`;
DROP TABLE IF EXISTS `notification`;

-- table for user role ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `userRole` (
    `roleID` INT DEFAULT 2 PRIMARY KEY,
    `roleName` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

insert into `userRole` (`createdAt`, `roleID`, `roleName`) values (CURRENT_TIMESTAMP, 1, 'Admin'), (CURRENT_TIMESTAMP, 2, 'User');

-- Table for user data -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `userData` (
  `userID` INT AUTO_INCREMENT PRIMARY KEY,
  `userEmail` VARCHAR(255) UNIQUE NOT NULL, 
  `userPassword` VARCHAR(255) NOT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `rollNumber` VARCHAR(50) NOT NULL,
  `phoneNumber` VARCHAR(15) NOT NULL,
  `roleID` INT DEFAULT 1,
  `collegeName` VARCHAR(255) NOT NULL, 
  `collegeCity` VARCHAR(255) NOT NULL,
  `userDepartment` VARCHAR(255) NOT NULL,
  `academicYear` INT NOT NULL,
  `degree` VARCHAR(100) NOT NULL,
  `needAccommodationDay1` BOOL DEFAULT FALSE,
  `needAccommodationDay2` BOOL DEFAULT FALSE,
  `needAccommodationDay3` BOOL DEFAULT FALSE,
  `isAmrita` BOOL DEFAULT TRUE NOT NULL,   -- Represents if email is amrita mail or individual mail
  `accountStatus` CHAR(1) DEFAULT '1' NOT NULL CHECK(`accountStatus` IN ('0','1','2')),  -- '0':Blocked  '1':Not verified  '2':Verified
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`roleID`) REFERENCES `userRole` (`roleID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2022, '2', 'Coimbatore', 'Amrita', 'B.Tech', 1, 0, 0, NULL, '8838517013', 1, 'CB.EN.U4CSE22447', 'CSE', 'thanuskumaara@gmail.com', 1, 'Thanus', 'Thanus2025');
insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2022, '2', 'Coimbatore', 'Amrita', 'B.Tech', 1, 0, 0, NULL, '1111111111', 1, 'CB.EN.U4CSE22240', 'CSE', 'naganathan1555@gmail.com', 2, 'Naganathan', 'Naga2025');
insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2022, '2', 'Coimbatore', 'Amrita', 'B.Tech', 1, 0, 0, NULL, '5045678555', 1, 'CB.EN.U4AIE220', 'AIE', 'sarandharshanpushparaj@gmail.com',3, 'Saran', 'Saran2025');
insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2021, '2', 'Coimbatore', 'Amrita', 'B.Tech', 1, 0, 0, NULL, '0000000011', 1, 'CB.EN.U4CSE21008', 'CSE', 'ash@admin.pragati', 4, 'Ashwin', 'password');

-- table for temporary otp storage (Engine:in-memory storage) -----------------------------------------

CREATE TABLE IF NOT EXISTS `otpTable` (
  `userID` INT NOT NULL PRIMARY KEY,
  `otp` VARCHAR(255),
  `expiryTime` TIMESTAMP NOT NULL DEFAULT ( createdAt + INTERVAL 5 MINUTE ),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`userID`) REFERENCES `userData` (`userID`) ON DELETE CASCADE
);


-- table for event data --------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `eventData` (
  `eventID` INT AUTO_INCREMENT PRIMARY KEY,
  `eventName` VARCHAR(255) UNIQUE NOT NULL,
  `imageUrl` VARCHAR(255) NOT NULL,
  `eventFee` INT NOT NULL,
  `eventDescription` VARCHAR(5000) NOT NULL,
  `venue` VARCHAR(1000),
  `time` VARCHAR(5000),
  `isGroup` BOOL DEFAULT FALSE,
  `maxTeamSize` INT DEFAULT 1 NOT NULL,
  `minTeamSize` INT DEFAULT 1 NOT NULL,
  `eventDate` CHAR(1) NOT NULL CHECK(`eventDate` IN ('1','2','3')),  -- the day of the events, so that the original date can be changed
  `eventStatus` CHAR(1) DEFAULT '1' CHECK(`eventStatus` IN ('0','1','2')), -- Blocked, Open, Full
  `numRegistrations` INT DEFAULT 0,
  `maxRegistrations` INT NOT NULL,
  `isPerHeadFee` BOOL DEFAULT FALSE,
  `godName` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `eventData` (`eventName`, `imageUrl`, `eventFee`, `eventDescription`, `venue`, `time`, `isGroup`, `maxTeamSize`, `minTeamSize`, `eventDate`, `eventStatus`, `numRegistrations`, `maxRegistrations`, `isPerHeadFee`, `godName`, `createdAt`, `updatedAt`) VALUES 
('Hackathon', 'https://example.com/hackathon.jpg', 500, 'Coding event with 24-hour hack challenge', 'Main Auditorium', '10:00 AM - 10:00 PM', TRUE, 4, 2, '1', '1', 0, 100, TRUE, 'Athena', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tech Quiz', 'https://example.com/quiz.jpg', 200, 'Technology-based quiz competition', 'Room A101', '2:00 PM - 4:00 PM', FALSE, 1, 1, '2', '1', 0, 50, FALSE, 'Hermes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- table for registration details ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `registrationData` (
  `registrationID` INT AUTO_INCREMENT PRIMARY KEY,
  `eventID` INT,
  `txnID` VARCHAR(255) NOT NULL UNIQUE,
  `amountPaid` INT NOT NULL DEFAULT 0,
  `totalMembers` INT NOT NULL DEFAULT 1,
  `teamName` VARCHAR(255) DEFAULT NULL,
  `userID` INT,
  `registrationStatus` CHAR(1) NOT NULL DEFAULT '1',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (`userID`) REFERENCES `userData` (`userID`) ON DELETE SET NULL,
  CONSTRAINT CHECK (registrationStatus IN ('1', '2', '3', '4', '5', '6', '7'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- registrationStatus:
-- 1 -> REGISTRATION INITIATED. PAYMENT PENDING
-- 2 -> REGISTERED. PAYED.
-- 3 -> USER CANCELLED REGISTRATION.
-- 4 -> EVENT WAS CANCELLED. NO REFUND.
-- 5 -> EVENT WAS CANCELLED, waiting for refund.
-- 6 -> EVENT WAS CANCELLED, refund done.
-- 7 -> EVENT WAS CANCELLED, refund also rejected.

INSERT INTO `registrationData` (`eventID`, `txnID`, `amountPaid`, `totalMembers`, `teamName`, `userID`, `registrationStatus`, `createdAt`, `updatedAt`) VALUES 
(1, 'TXN001', 500, 2, 'Code Masters', 2, '2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'TXN002', 200, 1, NULL, 3, '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- table for group information ----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `groupDetail` (
  `registrationID` INT NOT NULL,
  `userID` INT NOT NULL,
  `eventID` INT NOT NULL,
  `roleDescription` VARCHAR(255) DEFAULT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`registrationID`, `userID`),
  CONSTRAINT FOREIGN KEY (`userID`) REFERENCES `userData` (`userID`) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`),
  CONSTRAINT FOREIGN KEY (`registrationID`) REFERENCES `registrationData` (`registrationID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `groupDetail` (`registrationID`, `userID`, `eventID`, `roleDescription`, `createdAt`, `updatedAt`) VALUES 
(1, 2, 1, 'Team Leader', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- table for event organizer details  -------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `organizerData` (
  `organizerID` INT AUTO_INCREMENT PRIMARY KEY,
  `organizerName` VARCHAR(255) NOT NULL,
  `phoneNumber` VARCHAR(15) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `organizerData` (`organizerName`, `phoneNumber`, `createdAt`, `updatedAt`) VALUES 
('Saran', '9876543210', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Naganathan', '8765432109', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- table for mapping many-to-many relation between eventData and organizerData --------------------------

CREATE TABLE IF NOT EXISTS `organizerEventMapping` (
  `organizerID` INT NOT NULL,
  `eventID` INT NOT NULL,
  PRIMARY KEY (`organizerID`, `eventID`),
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (`organizerID`) REFERENCES `organizerData` (`organizerID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `organizerEventMapping` (`organizerID`, `eventID`) VALUES 
(1, 1), 
(2, 2);

-- table for tag data -------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tagData` (
  `tagID` INT AUTO_INCREMENT PRIMARY KEY,
  `tagName` VARCHAR(255) NOT NULL,
  `tagAbbrevation` VARCHAR(10) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tagData` (`tagName`, `tagAbbrevation`, `createdAt`, `updatedAt`) VALUES 
('Artificial Intelligence', 'AI', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Computer Science and Engineering', 'CSE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- table for mapping many-to-many relation between tagData and eventData --------------------------------

CREATE TABLE IF NOT EXISTS `tagEventMapping` (
  `tagID` INT NOT NULL,
  `eventID` INT NOT NULL,
  PRIMARY KEY (`tagID`, `eventID`),
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (`tagID`) REFERENCES `tagData` (`tagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tagEventMapping` (`tagID`, `eventID`) VALUES 
(1, 1),
(2, 2);

-- table for club data ------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `clubData` (
  `clubID` INT AUTO_INCREMENT PRIMARY KEY,
  `clubName` VARCHAR(255) NOT NULL,
  `imageUrl` VARCHAR(255) NOT NULL,
  `clubHead` VARCHAR(255),
  `clubAbbrevation` VARCHAR(50),
  `godName` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `clubData` (`clubName`, `imageUrl`, `clubHead`, `clubAbbrevation`, `godName`, `createdAt`, `updatedAt`) VALUES 
('Tech Club', 'https://example.com/techclub.jpg', 'Naganathan', 'TC', 'Zeus', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Coding Club', 'https://example.com/codingclub.jpg', 'Thanush', 'CC', 'Apollo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- table for mapping many-to-many relation between clubData and eventData ---------------------------------

CREATE TABLE IF NOT EXISTS `clubEventMapping` (
  `clubID` INT NOT NULL,
  `eventID` INT NOT NULL,
  PRIMARY KEY (`clubID`, `eventID`),
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (`clubID`) REFERENCES `clubData` (`clubID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `clubEventMapping` (`clubID`, `eventID`) VALUES 
(1, 1),
(2, 2);

-- table for handling notifications

CREATE TABLE IF NOT EXISTS `notification` (
  `notificationID` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) UNIQUE NOT NULL,
  `description` VARCHAR(2000) NOT NULL,
  `author` VARCHAR(255) NOT NULL,  -- can be ASB, Pragati team, Clubs etc..
  `venue` VARCHAR(500) NOT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `notification` (`title`, `description`, `author`, `venue`, `startDate`, `endDate`, `createdAt`, `updatedAt`) VALUES 
('Hackathon Announcement', 'Join the 24-hour coding hackathon and win prizes!', 'Pragati Team', 'Main Auditorium', '2025-03-01', '2025-03-02', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tech Quiz Registration', 'Register now for the upcoming Tech Quiz!', 'Tech Club', 'Room A101', '2025-03-05', '2025-03-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);