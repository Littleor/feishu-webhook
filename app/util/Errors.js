"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnexpectedError = exports.ServerError = exports.NotFound = exports.MissingParamenter = exports.WebhookError = void 0;
class WebhookError extends Error {
    constructor(name, httpCode, errorMessage) {
        super(errorMessage);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name || 'Error';
        this.httpCode = httpCode;
        Error.captureStackTrace(this);
    }
}
exports.WebhookError = WebhookError;
class MissingParamenter extends WebhookError {
    constructor(message) {
        super('MissingParamenter', 400, message);
    }
}
exports.MissingParamenter = MissingParamenter;
class NotFound extends WebhookError {
    constructor(message) {
        super('NotFound', 404, message);
    }
}
exports.NotFound = NotFound;
class ServerError extends WebhookError {
    constructor(message) {
        super('ServerError', 500, message);
    }
}
exports.ServerError = ServerError;
class UnexpectedError extends WebhookError {
    constructor(message) {
        super('UnexpectedError', 500, message);
    }
}
exports.UnexpectedError = UnexpectedError;
