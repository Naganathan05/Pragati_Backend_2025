import nodemailer from "nodemailer";
import { appendFileSync } from "fs";
import { appConfig } from "../../config/config.js";

// Template Imports
import TEMPLATE_OTP from "./template_otp.js";
import TEMPLATE_FORGOT_PASSWORD_OTP from "./template_forgot_password_otp.js";
import TEMPLATE_EVENT_REGISTRATION_OTP from "./template_event_registration_complete.js";

const mailTransporter = nodemailer.createTransport(appConfig.mailer.obj);

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

const sendMail = async (mailOption, logContext, userEmail) => {
    mailTransporter.sendMail(mailOption, function (error, info) {
        const logPrefix = `[${new Date().toLocaleString()} - ${logContext}]`;
        if (error) {
            console.log("[ERROR]: Error in Mailer", error);
            appendFileSync('./logs/mailer.log', `${logPrefix} Mailer - [ERROR]: ${error}\n`);
        } else {
            console.log(`[LOG]: ${logContext} Mail sent: ${userEmail}`);
            appendFileSync('./logs/mailer.log', `${logPrefix} - ${logContext} Mailer - [MESSAGE]: ${logContext} Mail sent: ${mailOption.to}\n`);
        }
    });
};

export const sendRegistrationOTP = async (userName, OTP, userEmail) => {
    const mailSubject = "Pragati 2025 - Account Registration - [OTP Verification]";
    const registrationMailOption = new mailOptions(userEmail, mailSubject, TEMPLATE_OTP(OTP, userName));
    await sendMail(registrationMailOption, "Account Registration OTP", userEmail);
}

export const sendForgotPasswordOtp = async (userName, OTP, userEmail) => {
    const mailSubject = "Pragati 2025 - Forgot Password - [OTP Verification]";
    const forgotPassMailOption = new mailOptions(userEmail, mailSubject, TEMPLATE_FORGOT_PASSWORD_OTP(OTP, userName));
    await sendMail(forgotPassMailOption, "Forgot Password OTP", userEmail);
}

export const sendEventRegistrationCompleteOtp = async (userEmail, userName, eventName, transactionId, totalMembers) => {
    const mailSubject = "Pragati 2025 - Event Registration Mail";
    const eventRegistrationMailOption = new mailOptions(userEmail, mailSubject, TEMPLATE_EVENT_REGISTRATION_OTP(userName, eventName, transactionId, totalMembers));
    await sendMail(eventRegistrationMailOption, "Event Registration OTP", userEmail);
}