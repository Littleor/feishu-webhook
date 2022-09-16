const express = require('express');
const bodyparser = require('body-parser');
const { secret } = require('./config.json');
const { genSign } = require('./app/utils');
const pushCommit = require('./app/pushCommit');
const createBranch = require('./app/createBranch');
const deleteBranch = require('./app/deleteBranch');
const pullRequest = require('./app/pullRequest');
const cmmmitComment = require('./app/cmmmitComment');

const app = express();
app.use(bodyparser.json())

app.post('/push', async (req, res) => {
    const result = await send(req)
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

async function send(req) {

    const { payload } = req.body;
    // get timestamp and sign
    const { timestamp, sign } = genSign((new Date().getTime()).toString().substring(0, 10), secret);
    // switch type
    const type = req.headers['x-github-event'];
    console.log('push type', type)
    switch (type) {
        case 'push': // push commit
            return await pushCommit(timestamp, sign, payload);
        case 'create': // create branch
            return await createBranch(timestamp, sign, payload);
        case 'delete': // delete branch
            return await deleteBranch(timestamp, sign, payload);
        case 'pull_request':
            return await pullRequest(timestamp, sign, payload);
        case 'commit_comment':
            return await cmmmitComment(timestamp, sign, payload);
    }
}


app.listen(9001, () => {
    console.log('listening on *:9001');
});
