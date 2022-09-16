const { uri } = require('../config.json');
const rp = require('request-promise');

// commit comment
module.exports = async function pushCommit(timestamp, sign, payload) {
    const user = payload.sender.login; // sender
    const repo = payload.repository.name; // repo name
    const comment = payload.comment.body; // comment
    const commentUrl = payload.comment.html_url; // comment url

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
                        content: `Commit Comment`,
                    },
                    template: 'orange'
                },
                elements: [
                    {
                        tag: 'div',
                        text: {
                            tag: "lark_md",
                            content: `**Repo: **${repo}`,
                        }
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
                                content: `${user}`
                            }
                        ]
                    },
                    {
                        tag: 'markdown',
                        content: `${comment}[点击查看comment详细信息](${commentUrl})`
                    }
                ]
            }
        },
        json: true
    }
    return await rp(options);
}
