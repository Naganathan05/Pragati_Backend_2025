const response = {
  responseCode: 200,
  responseBody: {
    MESSAGE: "",
    DATA: {},
  },
};

const setResponseOk = (message, data = {}) => {
  response.responseCode = 200;
  response.responseBody.MESSAGE = message;
  response.responseBody.DATA = data;
  return response;
};

const setResponseBadRequest = (message, data = {}) => {
  response.responseCode = 400;
  response.responseBody.MESSAGE = message;
  response.responseBody.DATA = data;
  return response;
};

const setResponseInternalError = (data = {}) => {
  response.responseCode = 500;
  response.responseBody.MESSAGE = "Internal Server Error occured :(";
  response.responseBody.DATA = data;
  return response;
};

const setResponseUnauth = (data = {}) => {
  response.responseCode = 401;
  response.responseBody.MESSAGE = "Unatorised Access Denied !!";
  response.responseBody.DATA = data;
  return response;
};

export {
  setResponseOk,
  setResponseBadRequest,
  setResponseUnauth,
  setResponseInternalError,
};
