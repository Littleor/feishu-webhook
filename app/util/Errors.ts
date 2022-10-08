export class WebhookError extends Error {
    public readonly name: string;
    public readonly httpCode: number;

    constructor(name: string, httpCode: number, errorMessage: string) {
        super(errorMessage);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name || 'Error';
        this.httpCode = httpCode;

        Error.captureStackTrace(this);
    }
}

export class MissingParamenter extends WebhookError {
    constructor(message: string) {
        super('MissingParamenter', 400, message);
    }
}

export class NotFound extends WebhookError {
    constructor(message: string) {
        super('NotFound', 404, message);
    }
}

export class ServerError extends WebhookError {
    constructor(message: string) {
        super('ServerError', 500, message);
    }
}

export class UnexpectedError extends WebhookError {
    constructor(message: string) {
        super('UnexpectedError', 500, message);
    }
}
