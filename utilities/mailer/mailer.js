import nodemailer from "nodemailer";
import { appConfig } from "../../config/config.js";
import { logError } from "../errorLogger.js";

// Template Imports
import TEMPLATE_OTP from "./template_otp.js";
import TEMPLATE_ANNOUNCEMENT from "./template_announcement.js";
import TEMPLATE_EVENT_ANNOUNCEMENT from "./template_event_announcement.js";
import TEMPLATE_FORGOT_PASSWORD_OTP from "./template_forgot_password_otp.js";
import TEMPLATE_EVENT_REGISTRATION_OTP from "./template_event_registration_complete.js";
import TEMPLATE_WELCOME from "./template_welcome.js"

const mailTransporter = nodemailer.createTransport(appConfig.mailer.obj);
const massMailerTransporter = nodemailer.createTransport(
    appConfig.massMailer.obj,
);

// Standard Class defined to avoid Redundancy in Mail Option Initialization.
class mailOptions {
    constructor(userEmail, subject, html) {
        this.from = {
            name: appConfig.mailer.name,
            address: appConfig.mailer.obj.auth.user,
        };
        this.to = userEmail;
        this.subject = subject;
        this.html = html;
    }
}

class massMailerOptions {
    constructor(userEmails, ccEmails, subject, html) {
        this.from = {
            name: appConfig.mailer.name,
            address: appConfig.mailer.obj.auth.user,
        };
        this.cc = ccEmails;
        this.bcc = userEmails;
        this.subject = subject;
        this.html = html;
    }
}

const sendMail = async (mailOption, logContext) => {
    mailTransporter.sendMail(mailOption, function (error, info) {
        if (error) {
            logError(error, logContext, "mailError");
        } else {
            logError("Mail sent successfully!", logContext, "mailLog");
        }
    });
};

const sendBulkMail = async (mailOption, logContext) => {
    massMailerTransporter.sendMail(mailOption, function (error, info) {
        if (error) {
            logError(error, logContext, "mailError");
        } else {
            logError("Mail sent successfully!", logContext, "mailLog");
        }
    });
};

export const sendWelcomeMail = async (userName, userEmail) => {
    const mailSubject = 
        "Welcome to Pragati 2025";
    const welcomeMailOptions = new mailOptions(
        userEmail,
        mailSubject,
        TEMPLATE_WELCOME(userName),
    )
    await sendMail(welcomeMailOptions, "Welcome Mail")
}

export const sendRegistrationOTP = async (userName, OTP, userEmail) => {
    const mailSubject =
        "Pragati 2025 - Account Registration - [OTP Verification]";
    const registrationMailOption = new mailOptions(
        userEmail,
        mailSubject,
        TEMPLATE_OTP(OTP, userName),
    );
    await sendMail(registrationMailOption, "Account Registration OTP");
};

export const sendForgotPasswordOtp = async (userName, OTP, userEmail) => {
    const mailSubject = "Pragati 2025 - Forgot Password - [OTP Verification]";
    const forgotPassMailOption = new mailOptions(
        userEmail,
        mailSubject,
        TEMPLATE_FORGOT_PASSWORD_OTP(OTP, userName),
    );
    await sendMail(forgotPassMailOption, "Forgot Password OTP");
};

export const sendEventRegistrationCompleteOtp = async (
    userEmail,
    userName,
    eventName,
    transactionId,
    totalMembers,
) => {
    const mailSubject = "Pragati 2025 - Event Registration Mail";
    const eventRegistrationMailOption = new mailOptions(
        userEmail,
        mailSubject,
        TEMPLATE_EVENT_REGISTRATION_OTP(
            userName,
            eventName,
            transactionId,
            totalMembers,
        ),
    );
    await sendMail(eventRegistrationMailOption, "Event Registration OTP");
};

export const sendAnnouncementMail = async (
    userEmails,
    ccEmails,
    announcement,
) => {
    const mailSubject = "Pragati 2025 - Announcement";
    const announcementMailOption = new massMailerOptions(
        userEmails,
        ccEmails,
        mailSubject,
        TEMPLATE_ANNOUNCEMENT(announcement),
    );
    await sendBulkMail(announcementMailOption, "Announcement Mail");
};

export const sendEventMail = async (
    userEmails,
    ccEmails,
    eventName,
    announcement,
) => {
    const mailSubject = "Pragati 2025 - " + eventName + " Event Announcement";
    const eventAnnouncementMailOption = new massMailerOptions(
        userEmails,
        ccEmails,
        mailSubject,
        TEMPLATE_EVENT_ANNOUNCEMENT(eventName, announcement),
    );
    await sendBulkMail(eventAnnouncementMailOption, "Event Announcement Mail");
};
