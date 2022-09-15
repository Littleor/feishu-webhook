const crypto = require('crypto');

// sha256 base64
// https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN?lang=zh-CN
// 安全设置：签名校验
function genSign(timestamp, secret) {
    const stringToSign = `${timestamp}\n${secret}`;
    return crypto.createHmac('sha256', stringToSign).digest('base64');
}

module.exports = {
    genSign
}
