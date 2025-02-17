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

insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2022, '2', 'Coimbatore', 'Amrita', 'B.Tech', 1, 0, 0, NULL, '8838517013', 1, 'CB.EN.U4CSE22447', 'CSE', 'thanuskumaara@gmail.com', 1, 'Thanus', 'c608f93243eefce1290a691f87aa2138af23c5b188b202f7f8afe9ea97ec51eb');
insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2022, '2', 'Coimbatore', 'Amrita', 'B.Tech', 1, 0, 0, NULL, '1234567895', 1, 'CB.EN.U4CSE22240', 'CSE', 'naganathan1555@gmail.com', 2, 'Naganathan', '21736c95b1e682f7abdee53019fd7e0ec7890bfee1a52be50cf024187fe7a0f4');
insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2022, '2', 'Coimbatore', 'Amrita', 'B.Tech', 1, 0, 0, NULL, '5045678555', 1, 'CB.EN.U4AIE220', 'AIE', 'sarandharshanpushparaj@gmail.com',3, 'Saran', '63def6a9b1444d3a5906bdd5b0e62334350402cfb344131b76270fc85f6eb383');
insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2021, '2', 'Coimbatore', 'Amrita', 'B.Tech', 1, 0, 0, NULL, '0000000011', 1, 'CB.EN.U4CSE21008', 'CSE', 'ash@admin.pragati', 4, 'Ashwin', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2024, '2', 'Coimbatore', 'Amrita', 'MBA', 1, 0, 0, NULL, '5045678555', 1, 'CB.BU.P2ASB24118', 'MBA', 'cb.bu.p2asb24118@cb.students.amrita.edu',5, 'Venkatesh', '7acb757ff67d2c9acfe682972bc0716599c8d6d568ab2c3962c677b74c7a9015');
insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2024, '2', 'Coimbatore', 'Amrita', 'MBA', 1, 0, 0, NULL, '0000000011', 1, 'CB.BU.P2ASB23136', 'MBA', 'cb.bu.p2asb23136@cb.students.amrita.edu', 6, 'Rohith', '4c8aa2b81fed49d1334adae94ddd009aaa4bc23a2f7d4c71cca3acad62dd85e1');
insert into `userData` (`academicYear`, `accountStatus`, `collegeCity`, `collegeName`, `degree`, `isAmrita`, `needAccommodationDay1`, `needAccommodationDay2`, `needAccommodationDay3`, `phoneNumber`, `roleID`, `rollNumber`, `userDepartment`, `userEmail`, `userID`, `userName`, `userPassword`) values (2024, '2', 'Coimbatore', 'Amrita', 'MBA', 1, 0, 0, NULL, '0000000011', 1, 'CB.BU.P2ASB23117', 'MBA', 'cb.bu.p2asb23117@cb.students.amrita.edu', 7, 'Madridsta', 'dc22f903267b50ad4622c053e06c5123cc1eebe19f21e9a757f832d7cac1469d');

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
  `rules` TEXT,
  `isGroup` BOOL DEFAULT FALSE,
  `maxTeamSize` INT DEFAULT 1 NOT NULL,
  `minTeamSize` INT DEFAULT 1 NOT NULL,
  `eventDate` CHAR(1) NOT NULL CHECK(`eventDate` IN ('1','2','3')),  -- the day of the events, so that the original date can be changed
  `eventStatus` CHAR(1) DEFAULT '1' CHECK(`eventStatus` IN ('0','1','2')), -- Blocked, Open, Full
  `numRegistrations` INT DEFAULT 0,
  `maxRegistrations` INT NOT NULL DEFAULT 0,
  `isPerHeadFee` BOOL DEFAULT FALSE,
  `firstPrice` VARCHAR(255) DEFAULT NULL,
  `secondPrice` VARCHAR(255) DEFAULT NULL,
  `thirdPrice` VARCHAR(255) DEFAULT NULL,
  `fourthPrice` VARCHAR(255) DEFAULT NULL,
  `fifthPrice` VARCHAR(255) DEFAULT NULL,
  `godName` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `eventData` (`eventName`, `imageUrl`, `eventFee`, `eventDescription`, `venue`, `time`, `isGroup`, `maxTeamSize`, `minTeamSize`, `eventDate`, `eventStatus`, `numRegistrations`, `maxRegistrations`, `isPerHeadFee`, `godName`, `createdAt`, `updatedAt`, `firstPrice`, `secondPrice`, `thirdPrice`) VALUES 
('THE RENAISSANCE CIRCUIT', 'https://example.com/hackathon.jpg', 400, 
'Round 1 - The Arena\nTeams will be randomly paired to compete against each other in a competitive arena. Positioned on opposite sides, pairs will tackle 7 rapid-fire questions. Answer correctly to advance: one wrong move, and you''re out!\n
\n
Round 2 - The Forge of Innovation\nQualifying teams will tackle a real-world case study, showcasing their analytical skills and innovative ideas. Impress the jury with dynamic and engaging presentations to claim victory!\n
\n
Round 3 - Judgement\nIn the debate round, teams will be paired again to go head-to-head. Members will be assessed by the forum on key performance criteria. Stand out to secure your spot!'
, 'CR4', 'Full day', TRUE, 5, 4, '1', '1', 0, 100, TRUE, 'Athena', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, "17,000 Rs", "8,000 Rs", "4,000 Rs"),
('OLYMPIAN CONCLAVE', 'https://example.com/quiz.jpg', 450, '
Showcase your marketing brilliance in this dynamic competition! From creative charades and problem-solving to crafting live campaigns, this is your chance to win. Compete, create, and conquer! '
, 'CR6', 'Full day', TRUE, 6, 3, '2', '1', 0, 50, TRUE, 'Hermes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '25,000 Rs', NULL, NULL),
('SOLO DANCE FREE STYLE', 'https://example.com/quiz.jpg', 200, '
A captivating solo freestyle dance blending fluid, dynamic movements with wild abandon, embodying celebration, creativity, and divine intoxication. Elegantly merging power and grace, the performance transports the audience to a mythical realm of energy and allure.'
, 'SKH', 'Full day', FALSE, 1, 1, '2', '1', 0, 50, TRUE, 'Hermes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '3,000 Rs', '1,500 Rs', NULL),
('CANVA PAINTING', 'https://example.com/quiz.jpg', 250, '
The painting blends classical mythology with contemporary elements, showcasing innovation, collaboration, and the joy of success in the corporate world. Rich colors and dynamic forms highlight the harmony between ancient wisdom and modern enterprise.'
, 'ER4', 'Full day', FALSE, 1, 1, '1', '1', 0, 100, TRUE, 'Athena', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '2,500 Rs', '1,000 Rs', NULL);

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
(1, 'TXN-2-1-1739608418732', 500, 2, 'Code Masters', 2, '2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'TXN-1-2-1739608433882', 200, 1, NULL, 3, '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- table for group information ----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `groupDetail` (
  `registrationID` INT NOT NULL,
  `userID` INT NOT NULL,
  `eventID` INT NOT NULL,
  `roleDescription` VARCHAR(255) DEFAULT "Participant",
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
('Vineeth K', '9496575768', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Aiswarya Sreenivasan', '7306104589', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Suganth Vaibav', '9940880052', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gurucharan', ' 7010775817', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Shreelekha', '8778950690', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

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
(2, 2),
(3, 3),
(4, 3),
(5, 3),
(3, 4),
(4, 4),
(5, 4);

-- table for tag data -------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tagData` (
  `tagID` INT AUTO_INCREMENT PRIMARY KEY,
  `tagName` VARCHAR(255) NOT NULL,
  `tagAbbrevation` VARCHAR(10) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `tagData` (`tagName`, `tagAbbrevation`, `createdAt`, `updatedAt`) VALUES 
('Management Games', 'MGS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Non Management Games', 'NGS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

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
(1, 2),
(2, 3),
(2, 4);

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
('Sanskriti', 'https://example.com/techclub.jpg', 'Naganathan', 'SKT', 'Zeus', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ozone', 'https://example.com/codingclub.jpg', 'Thanush', 'OZ', 'Apollo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('GenM', 'https://example.com/codingclub.jpg', 'Saran', 'GM', 'Apollo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- table for mapping many-to-many relation between clubData and eventData ---------------------------------

CREATE TABLE IF NOT EXISTS `clubEventMapping` (
  `clubID` INT NOT NULL,
  `eventID` INT NOT NULL,
  PRIMARY KEY (`clubID`, `eventID`),
  CONSTRAINT FOREIGN KEY (`eventID`) REFERENCES `eventData` (`eventID`) ON DELETE CASCADE,
  CONSTRAINT FOREIGN KEY (`clubID`) REFERENCES `clubData` (`clubID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `clubEventMapping` (`clubID`, `eventID`) VALUES 
(1, 3),
(1, 4),
(2, 1),
(3, 2);

-- table for handling notifications

CREATE TABLE IF NOT EXISTS `notification` (
  `notificationID` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) UNIQUE NOT NULL,
  `description` VARCHAR(2000) NOT NULL,
  `author` VARCHAR(255) NOT NULL,  -- can be ASB, Pragati team, Clubs etc..
  `venue` VARCHAR(500) NOT NULL,
  `startDate` VARCHAR(10) NOT NULL,
  `endDate` VARCHAR(10) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `notification` (`title`, `description`, `author`, `venue`, `startDate`, `endDate`, `createdAt`, `updatedAt`) VALUES 
('Curtain Raiser', 'Curtain Raiser along with the amazing Flashmob by our talented dancers.', 'Pragati Team', 'ASB Block', '2025-01-04', '2025-01-04', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Food Fest', 'Experience the magic of our Food Fest through the eyes of our guests.', 'Pragati Team', 'AB3 Car Parking', '2025-01-05', '2025-01-08', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);