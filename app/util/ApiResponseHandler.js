"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiSuccessResponse = exports.apiResponse = void 0;
const apiResponse = (res, status, code, type, message, errorCode) => {
    const response = { code, type, message, errorCode };
    res.status(status);
    res.json(response);
};
exports.apiResponse = apiResponse;
const apiSuccessResponse = (res, result) => {
    if (result === null || result === undefined) {
        res.status(204);
        res.json();
    }
    else {
        res.status(200);
        res.json(result);
    }
};
exports.apiSuccessResponse = apiSuccessResponse;
