import { setResponseInternalError } from "../utilities/response.js";
import adminModule from "../module/adminModule.js";
import { logError } from "../utilities/errorLogger.js";

const adminController = {
  getAllTransactions : async (req, res) => {
    try {
      const response = await adminModule.getAllTransactions();
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "adminController:getAllTransactions", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },
  getAllRoles: async (req, res) => {
    try {
      const response = await adminModule.getAllRoles();
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "adminController:getAllRoles", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },
  getEventWiseAmountGenerated: async (req, res) => {
    try {
      const response = await adminModule.getEventWiseAmountGenerated();
      return res.status(response.responseCode).json(response.responseBody);
    } catch (error) {
      logError(error, "adminController:getEventWiseAmountGenerated", "db");
      const response = setResponseInternalError();
      return res.status(response.responseCode).json(response.responseBody);
    }
  },
};

export default adminController;