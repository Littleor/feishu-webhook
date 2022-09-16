const crypto = require('crypto');
const rp = require('request-promise');
const fs = require('fs');
// sha256 base64
// https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN?lang=zh-CN
// 安全设置：签名校验
function genSign(timestamp, secret) {
    const stringToSign = `${timestamp}\n${secret}`;
    return {
        timestamp,
        sign: crypto.createHmac('sha256', stringToSign).digest('base64')
    };
}

// 图片上传
async function uploadImage(image_url, userName) {
    // TODO: 先判断本地里面有没有这个图片，没有图片就去请求图片放到本地同时上传到飞书服务器
    const response = await rp({ uri: image_url, encoding: 'binary' });
    // TODO: 没有文件夹创建文件夹
    fs.writeFileSync(`temp/${userName}.png`, response, 'binary');
    let imageKey = null
    try {
        const result = await sendImageToFeishu(userName);
        imageKey = result.data.image_key;
    } catch (error) {
        console.log(error.message);
    }
    return imageKey;
}

async function sendImageToFeishu(userName) {
    const options = {
        uri: 'https://open.feishu.cn/open-apis/image/v4/put/',
        headers: {
            'Authorization': "Bearer t-7f1bcd13fc57d46bac21793a18e560"
        },
        formData: {
            image: fs.createReadStream(__dirname + `/temp/${userName}.png`),
            image_type: 'avatar'
        },
    }

    return await rp(options)
}

module.exports = {
    genSign,
    uploadImage
}
