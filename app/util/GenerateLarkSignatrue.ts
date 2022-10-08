import crypto from 'crypto';

const generateLarkSignature = (timestamp: string, secret: string): string => {
    const stringToSign = `${timestamp}\n${secret}`;
    return crypto.createHmac('sha256', stringToSign).digest('base64');
};

export default generateLarkSignature;
