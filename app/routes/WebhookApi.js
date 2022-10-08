"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const ApiResponseHandler_1 = require("../util/ApiResponseHandler");
const GithubController_1 = __importDefault(require("../controllers/GithubController"));
exports.router = express_1.default.Router();
exports.router.post('/github', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Rech Post /webhook/github');
    const payload = req.body;
    const type = req.headers['x-github-event'];
    console.log('webhook type', type);
    GithubController_1.default.generateLarkMessage(type, payload)
        .then((result) => {
        (0, ApiResponseHandler_1.apiSuccessResponse)(res, result);
    })
        .catch((error) => {
        next(error);
    });
}));
