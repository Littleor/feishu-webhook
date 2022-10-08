import { Response } from 'express';
import { components } from '../schema/GeneratedSchema';
import { HttpCode } from '../util/HttpCodes';

type ApiResponse = components['schemas']['ApiResponse'];
type ErrorCode = components['schemas']['ErrorCode'];

export const apiResponse = (
    res: Response,
    status: HttpCode,
    code: number,
    type: string,
    message: string,
    errorCode?: ErrorCode,
) => {
    const response: ApiResponse = { code, type, message, errorCode };
    res.status(status);
    res.json(response);
};

export const apiSuccessResponse = (res: Response, result?: unknown) => {
    if (result === null || result === undefined) {
        res.status(204);
        res.json();
    } else {
        res.status(200);
        res.json(result);
    }
};
