const { uri } = require('../config.json');
const rp = require('request-promise');

//  delete branch
module.exports = async function deleteBranch(timestamp, sign, payload) {
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
                        content: `Delete Branch`,
                    },
                    template: 'red'
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
                        tag: 'markdown',
                        content: `*${user}* delete branch: **${branch}**`
                    }
                ]
            }
        },
        json: true
    }
    return await rp(options);
}
