const { uri } = require('../config.json');
const rp = require('request-promise');

// pull request
module.exports = async function pullRequest(timestamp, sign, payload) {
    const user = payload.sender.login; // pusher
    const repo = payload.repository.name; // repo name
    const action = payload.action; // pull request status
    const content = payload.pull_request.title; // pull content
    const rpUrl = payload.pull_request.html_url; // pull request url

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
                        content: `Pull Request(${action})`,
                    },
                    template: 'wathet'
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
                        content: `*${user}* ${action} a pull request: ${content}\n👉👉👉[点击查看RP详细信息](${rpUrl})`
                    }
                ]
            }
        },
        json: true
    }
    return await rp(options);
}
