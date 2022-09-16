// const { uploadImage }= require('./utils');
const { uri } = require('../config.json');
const rp = require('request-promise');

// push commit
module.exports = async function pushCommit(timestamp, sign, payload) {
    const user = payload.pusher.name; // pusher
    /** 自定义机器人中不支持上传图片
     * const avatarUrl = payload.sender.avatar_url;
     * const imageKey = await uploadImage(avatarUrl, user);
     */
    //
    const repo = payload.repository.name; // repo name
    const branch = payload.ref; // branch name
    // get all commits
    const elements = payload.commits.map(item => ({
        tag: 'markdown',
        content: `Commit ID: ${(item.id).substring(0, 7)}Commit message: ${item.message}[点击查看commit详细信息](${item.url})`
    }));

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
                    ...elements,
                ]
            }
        },
        json: true
    }
    return await rp(options);
}
