import express, { Express, Request, Response } from 'express';
import dotEnv from 'dotenv';
import * as OpenApiValidator from 'express-openapi-validator';
import { router as WebhookRoutes } from './routes/WebhookApi';
import path from 'path';

dotEnv.config({ path: path.resolve(__dirname, './config/.env') });

const app: Express = express();
const port = process.env.PORT;
console.log(path.resolve(__dirname, './config/.env'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    OpenApiValidator.middleware({
        apiSpec: './openapi.yaml',
        validateRequests: true, // (default)
        validateResponses: true, // false by default
    }),
);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TS server');
});

app.use('/webhook', WebhookRoutes);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
