import tagModule from "../module/tagModule.js";
import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import {
    validateTagData,
    validateTagId,
} from "../utilities/dataValidator/tagValidator.js";

const tagController = {
    addTag: async (req, res) => {
        const validationError = validateTagData(req.body);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        const { tagName, tagAbbrevation } = req.body;

        try {
            const response = await tagModule.addTag(tagName, tagAbbrevation);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getAllTags: async (_, res) => {
        try {
            const response = await tagModule.getAllTags();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    removeTag: async (req, res) => {
        const { tagID } = req.body;
        const validationError = validateTagId(tagID);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await tagModule.removeTag(tagID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    editTag: async (req, res) => {
        const { tagID, tagName, tagAbbrevation } = req.body;
        const idValidationError = validateTagId(tagID);
        if (idValidationError) {
            const response = setResponseBadRequest(idValidationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        const validationError = validateTagData(req.body);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await tagModule.editTag(
                tagID,
                tagName,
                tagAbbrevation,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default tagController;
