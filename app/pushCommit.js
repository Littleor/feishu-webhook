const { uri } = require('../config.json');
const rp = require('request-promise');

// push commit
module.exports = async function pushCommit(timestamp, sign, payload) {
    const user = payload.pusher.name; // pusher
    const repo = payload.repository.name; // repo name
    const branch = payload.ref; // branch name
    // get all commits
    const elements = payload.commits.reduce((acc, cur, i, arr) => {
        const item = {
            tag: 'markdown',
            content: `*Commit ID:* ${cur.id}\n*Commit message:* ${cur.message}\n👉👉👉[点击查看commit详细信息](${cur.url})`
        }
        return (arr.length > 1 && i < arr.length - 1) ? acc.concat(item, { tag: 'hr' }) : acc.concat(item)
    }, [])

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
                        content: `Push Commit`,
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
                        tag: 'div',
                        text: {
                            tag: "lark_md",
                            content: `**Branch: **${branch}`,
                        },
                    },
                    {
                        tag: 'div',
                        text: {
                            tag: "lark_md",
                            content: `**Sender: **${user}`,
                        },
                    },
                    ...elements,
                ]
            }
        },
        json: true
    }
    return await rp(options);
}
