const express = require('express');
const rp = require('request-promise');
const bodyparser = require('body-parser');
const { urls, secrets } = require('./config.json');
const { genSign } = require('./sign')

const app = express();
app.use(bodyparser.json())

app.post('/push/:repository', async (req, res) => {
    const { repository } = req.params;
    const result = await send(repository, req.body.payload)
    const { StatusCode, StatusMessage, code, msg } = result
    if (StatusCode === 0) {
        res.json({
            message: StatusMessage,
            code: StatusCode
        })
    } else {
        res.json({
            code,
            message: msg
        })
    }
})

async function send(repository, payload) {
    const uri = urls[repository];
    const timestamp = (new Date().getTime()).toString().substring(0, 10);
    const sign = genSign(timestamp, secrets[repository])
    return await sendWebhook(uri, timestamp, sign, payload);
}

async function sendWebhook(uri, timestamp, sign, payload) {
    const user = payload.pusher.name;
    // get all commits
    const content = payload.commits.map(item => {
        return ([
            {
                tag: 'text',
                text: `Commit ID: ${(item.id).substring(0, 7)}`
            },
            {
                tag: 'a',
                text: '点击查看 commit 详细信息',
                href: item.url
            },

        ])
    });
    // add @all
    content.push([ {
        "tag": "at",
        "user_id": "all",
    }]);

    const options = {
        method: 'POST',
        uri,
        body: {
            timestamp,
            sign,
            msg_type: 'post',
            content: {
                post: {
                    "zh_cn": {
                        title: `${user} 提交了新的 Commit`,
                        content
                    }
                }
            }
        },
        json: true
    }
    return await rp(options);
}

app.listen(9001, () => {
    console.log('listening on *:9001');
});
