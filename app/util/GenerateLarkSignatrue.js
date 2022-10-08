"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generateLarkSignature = (timestamp, secret) => {
    const stringToSign = `${timestamp}\n${secret}`;
    return crypto_1.default.createHmac('sha256', stringToSign).digest('base64');
};
exports.default = generateLarkSignature;
