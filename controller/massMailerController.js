import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import { validateMassMails } from "../utilities/dataValidator/massMails.js";
import massMailerModule from "../module/massMailerModule.js";

const massMailerController = {
    /*
      Request Header: Bearer OTP Token
      allParticipantMailer Request Body
      {
          "ccEmails": "Array[String]" [Mandatory]
          "announcement": "String" [Mandatory]
      }
    */
    allParticipantMailer: async (req, res) => {
        const { ccEmails, announcement, userID } = req.body;

        if (!announcement) {
            const response = setResponseBadRequest("Invalid Announcement !");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        if (!validateMassMails(ccEmails)) {
            const response = setResponseBadRequest(
                "Invalid CC Email Address !",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await massMailerModule.allParticipantsMailer(
                ccEmails,
                announcement,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            console.log(
                "[ERROR]: Error in All Participant Mailer Controller: ",
                err,
            );
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    /*
      Request Header: Bearer OTP Token
      Event Participant Mailer Request Body
      {
          "ccEmails": "Array[String]" [Mandatory]
          "eventID": "integer" [Mandatory]
          "announcement": "String" [Mandatory]
      }
    */
    eventParticipantMailer: async (req, res) => {
        const { eventID, ccEmails, announcement, userID } = req.body;

        if (!announcement) {
            const response = setResponseBadRequest("Invalid Announcement !");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        if (!validateMassMails(ccEmails)) {
            const response = setResponseBadRequest(
                "Invalid CC Email Address !",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await massMailerModule.eventParticipantsMailer(
                eventID,
                ccEmails,
                announcement,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            console.log(
                "[ERROR]: Error in Event Participants Mailer Controller: ",
                err,
            );
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    /*
      Request Header: Bearer OTP Token
      Selected Users Email Request Body
      {
          "userEmails": "Array[String]" [Mandatory]
          "ccEmails": "Array[String]" [Mandatory]
          "announcement": "String" [Mandatory]
      }
    */
    selectedParticipantMailer: async (req, res) => {
        const { userEmails, ccEmails, announcement, userID } = req.body;

        if (!announcement) {
            const response = setResponseBadRequest("Invalid Announcement !");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        if (!validateMassMails(userEmails)) {
            const response = setResponseBadRequest(
                "Invalid User Email Address !",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        if (!validateMassMails(ccEmails)) {
            const response = setResponseBadRequest(
                "Invalid CC Email Address !",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await massMailerModule.selectedParticipantsMailer(
                userEmails,
                ccEmails,
                announcement,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            console.log(
                "[ERROR]: Error in Selected Participants Mailer Controller: ",
                err,
            );
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default massMailerController;
