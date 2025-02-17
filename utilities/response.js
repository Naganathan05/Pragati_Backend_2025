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

const setResponseNotFound = (message, data = {}) => {
    response.responseCode = 404;
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
    response.responseBody.MESSAGE = "Unauthorised Access Denied !!";
    response.responseBody.DATA = data;
    return response;
};

const setResponseTimedOut = (message, data = {}) => {
    response.responseCode = 408;
    response.responseBody.MESSAGE = message;
    response.responseBody.DATA = data;
    return response;
};

const setResponseTransactionFailed = (message, data = {}) => {
    response.responseCode = 202;
    response.responseBody.MESSAGE = message;
    response.responseBody.DATA = data;
    return response;
};

const setResponseServiceFailure = (message, data = {}) => {
    response.responseCode = 502;
    response.responseBody.MESSAGE = message;
    response.responseBody.DATA = data;
    return response;
};

export {
    setResponseOk,
    setResponseNotFound,
    setResponseBadRequest,
    setResponseUnauth,
    setResponseInternalError,
    setResponseTimedOut,
    setResponseTransactionFailed,
    setResponseServiceFailure,
};
