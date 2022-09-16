// const { uploadImage }= require('./utils');
const { uri } = require('../config.json');
const rp = require('request-promise');

//  create branch
module.exports = async function createBranch(timestamp, sign, payload) {
    const user = payload.sender.login; // sender
    const repo = payload.repository.name; // repo name
    const branch = payload.ref; // branch name

    const options = {
        method: 'POST',
        uri,
        body: {
            timestamp,
            sign,
            msg_type: 'interactive',
            card: {
                config: {
                    "wide_screen_mode": true,
                    "enable_forward": true
                },
                header: {
                    title: {
                        tag: "plain_text", // 只支持 plain-text
                        content: `Create Branch`,
                    },
                    template: 'turquoise'
                },
                elements: [
                    {
                        tag: 'div',
                        text: {
                            tag: "lark_md",
                            content: `**Repo: **${repo}`,
                        },
                    },
                    {
                        tag: "note",
                        elements: [
                            {
                                tag: "img",
                                img_key: "img_e344c476-1e58-4492-b40d-7dcffe9d6dfg",
                                alt: {
                                    tag: "plain_text",
                                    content: `${user}`
                                }
                            },
                            {
                                tag: "plain_text",
                                content: `${user} 创建了分支 ${branch}`
                            }
                        ]
                    }
                ]
            }
        },
        json: true
    }
    return await rp(options);
}
