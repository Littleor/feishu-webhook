import express, { NextFunction, Request, Response } from 'express';
import { apiSuccessResponse } from '../util/ApiResponseHandler';
import GithubController from '../controllers/GithubController';

export const router = express.Router();

router.post('/github', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Rech Post /webhook/github');
    const payload = req.body;
    const type = req.headers['x-github-event'] as string;
    console.log('github webhook type', type);
    GithubController.generateLarkMessage(type, payload)
        .then((result) => {
            apiSuccessResponse(res, result);
        })
        .catch((error: unknown) => {
            next(error);
        });
});
