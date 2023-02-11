import fetch from 'node-fetch';
import { components } from '../schema/GeneratedSchema';
import { ServerError } from '../util/Errors';
import generateLarkSignature from '../util/GenerateLarkSignatrue';

type GithubWebhookReq = components['schemas']['GithubWebhookReq'];
type LarkWebhookRes = components['schemas']['LarkWebhookRes'];
type GithubWebhookCommit = components['schemas']['GithubWebhookCommit'];

// webhook
const uri = process.env.FEISHU_URI;
// signature secret
const secret = process.env.FEISHU_SECRET;

if (!uri || !secret) {
    throw new ServerError('Please set the environment variable FEISHU_URI and FEISHU_SECRET:');
}

const GithubRequestEvent = new Map([
    ['create', generateCreateBranchMessage],
    ['delete', generateDeleteBranchMessage],
    ['push', generatePushCommitMessage],
    ['pull_request', generatePullRequestMessage],
    ['commit_comment', generateCommitCommentMessage],
    ['issues', generateIssuesMessage],
    ['issue_comment', generateIssueCommentMessage],
    ['pull_request_review_comment', generatePullRequestReviewCommentMessage],
    ['workflow_run', generateWorkflowRunMessage],
]);

const generateLarkMessage = async (type: string, payload: GithubWebhookReq): Promise<LarkWebhookRes> => {
    const user: string = payload.sender.login;
    const repo: string = payload.repository.name;
    const timestamp = new Date().getTime().toString().substring(0, 10);
    const sign = generateLarkSignature(timestamp, secret);
    const generateMessage = GithubRequestEvent.get(type);
    if (!generateMessage) {
        throw new ServerError('the server transform webhook failed');
    } else {
        const { title, template, elements } = generateMessage(payload);
        const options = {
            timestamp,
            sign,
            msg_type: 'interactive',
            card: {
                config: {
                    wide_screen_mode: true,
                    enable_forward: true,
                },
                header: {
                    title: {
                        tag: 'plain_text', // 只支持 plain-text
                        content: title,
                    },
                    template,
                },
                elements: [
                    {
                        tag: 'div',
                        text: {
                            tag: 'lark_md',
                            content: `**Repo: **${repo}`,
                        },
                    },
                    {
                        tag: 'div',
                        text: {
                            tag: 'lark_md',
                            content: `**Sender: **${user}`,
                        },
                    },
                    ...elements,
                ],
            },
        };
        return fetch(uri, { method: 'POST', body: JSON.stringify(options) }).then(
            (res) => res.json() as LarkWebhookRes,
        );
    }
};

// create branch
function generateCreateBranchMessage(payload: GithubWebhookReq) {
    const user = payload.sender.login;
    const branch = payload.ref as string;
    return {
        title: 'Create Branch',
        template: 'blue',
        elements: [
            {
                tag: 'markdown',
                content: `**${user}** create new branch: **${branch}**`,
            },
        ],
    };
}

// delete branch
function generateDeleteBranchMessage(payload: GithubWebhookReq) {
    const branch = payload.ref as string;
    const user = payload.sender.login;

    return {
        title: 'Delete Branch',
        template: 'red',
        elements: [
            {
                tag: 'markdown',
                content: `**${user}** delete branch: **${branch}**`,
            },
        ],
    };
}

// push commit
function generatePushCommitMessage(payload: GithubWebhookReq) {
    const branch = payload.ref as string;
    const commits = payload.commits as GithubWebhookCommit[];
    const created = payload.created as boolean;
    const deleted = payload.deleted as boolean;
    const forced = payload.forced as boolean;
    const elements = commits.reduce((acc: { tag: string; content?: string }[], cur, i, arr) => {
        const item = {
            tag: 'markdown',
            content: `*Commit ID:* ${cur.id}\n*Commit message:* ${cur.message}\n👉👉👉[点击查看commit详细信息](${cur.url})`,
        };
        return arr.length > 1 && i < arr.length - 1 ? acc.concat(item, { tag: 'hr' }) : acc.concat(item);
    }, []);
    // judge ref status
    let refStatus = '';
    if (created) {
        refStatus = 'Branch Created';
    } else if (deleted) {
        refStatus = 'Branch Deleted';
    } else if (forced) {
        refStatus = 'Forced';
    }
    return {
        title: refStatus ? `Push Commit(${refStatus})` : 'Push Commit',
        template: refStatus ? 'red' : 'turquoise',
        elements: [
            {
                tag: 'div',
                text: {
                    tag: 'lark_md',
                    content: `**Branch: **${branch}`,
                },
            },
            ...elements,
        ],
    };
}

// pull request
function generatePullRequestMessage(payload: GithubWebhookReq) {
    const user = payload.sender.login;
    const action = payload.action as string; // pull request status
    const content = payload.pull_request?.title; // pull content: ;
    const rpUrl = payload.pull_request?.html_url; // pull request url
    return {
        title: `Pull Request[${action}]`,
        template: 'wathet',
        elements: [
            {
                tag: 'markdown',
                content: `**${user}** ${action} a pull request: ${content}\n👉👉👉[点击查看PR详细信息](${rpUrl})`,
            },
        ],
    };
}

// commit comment
function generateCommitCommentMessage(payload: GithubWebhookReq) {
    const user = payload.sender.login;
    const comment = payload.comment?.body; // comment
    const commentUrl = payload.comment?.html_url; // comment url
    return {
        title: `Comment(Commit)`,
        template: 'orange',
        elements: [
            {
                tag: 'markdown',
                content: `**${user}** commit comment: ${comment}\n👉👉👉[点击查看comment详细信息](${commentUrl})`,
            },
        ],
    };
}

// opened or closed issue
function generateIssuesMessage(payload: GithubWebhookReq) {
    const user = payload.sender.login;
    const action = payload.action;
    const issue = payload.issue?.title; // issue content
    const issueUrl = payload.issue?.html_url; // issue url
    return {
        title: `Issue[${action}]`,
        template: 'purple',
        elements: [
            {
                tag: 'markdown',
                content: `**${user}** ${action} issue: ${issue}\n👉👉👉[点击查看issue详细信息](${issueUrl})`,
            },
        ],
    };
}

// issue comment
function generateIssueCommentMessage(payload: GithubWebhookReq) {
    const user = payload.sender.login;
    const action = payload.action;
    const issue = payload.issue?.title; // issue content
    const comment = payload.comment?.body; // issue comment content
    const commentUrl = payload.comment?.html_url; // issue comment url
    return {
        title: `Comment(Issue)[${action}]`,
        template: 'carmine',
        elements: [
            {
                tag: 'div',
                text: {
                    tag: 'lark_md',
                    content: `**Issue: **${issue}`,
                },
            },
            {
                tag: 'markdown',
                content:
                    action === 'deleted'
                        ? `**${user}** ${action} comment: ${comment}`
                        : `**${user}** ${action} comment: ${comment}\n👉👉👉[点击查看comment详细信息](${commentUrl})`,
            },
        ],
    };
}

// pull request review comment
function generatePullRequestReviewCommentMessage(payload: GithubWebhookReq) {
    const user = payload.sender.login;
    const action = payload.action;
    const prContent = payload.pull_request?.title;
    const comment = payload.comment?.body; // issue comment content
    const commentUrl = payload.comment?.html_url; // issue comment url

    return {
        title: `Comment(PR Review)[${action}]`,
        template: 'indigo',
        elements: [
            {
                tag: 'div',
                text: {
                    tag: 'lark_md',
                    content: `**PR: **${prContent}`,
                },
            },
            {
                tag: 'div',
                text: {
                    tag: 'lark_md',
                    content:
                        action === 'deleted'
                            ? `**${user}** deleted pull request review comment: ${comment}\n👉👉👉[点击查看comment详细信息](${commentUrl})`
                            : `**${user}** ${action} pull request review comment: ${comment}\n👉👉👉[点击查看comment详细信息](${commentUrl})`,
                },
            },
        ],
    };
}

function generateWorkflowRunMessage(payload: GithubWebhookReq) {
    const user = payload.sender.login;
    const action = payload.action;
    const workflow = payload.workflow_run?.name;
    const workflowUrl = payload.workflow_run?.html_url;
    const conclusion = payload.workflow_run?.conclusion;
    const status = payload.workflow_run?.status;
    const whiteList = JSON.parse(process.env.WORKFLOW_WHITELIST || '[]');
    if (!whiteList.includes(action)) {
        throw new ServerError('the server not support the workflow');
    }
    return {
        title: `Workflow Run[${action}]`,
        template: 'green',
        elements: [
            {
                tag: 'markdown',
                content: `**Status**: ${status}${conclusion ? `(${conclusion})` : ''}`,
            },
            {
                tag: 'markdown',
                content: `**${user}** ${action} workflow: ${workflow}\n👉👉👉[点击查看workflow详细信息](${workflowUrl})`,
            },
        ],
    };
}

export default { generateLarkMessage };
