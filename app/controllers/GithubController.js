"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const Errors_1 = require("../util/Errors");
const GenerateLarkSignatrue_1 = __importDefault(require("../util/GenerateLarkSignatrue"));
// webhook
const uri = 'https://open.feishu.cn/open-apis/bot/v2/hook/437ee9c4-267b-4948-bf7e-32da9bca4607';
// signature secret
const secret = 'KaVrOt6WB1G6UIIQOxEnZd';
const GithubRequestEvent = new Map([
    ['create', generateCreateBranchMessage],
    ['delete', generateDeleteBranchMessage],
    ['push', generatePushCommitMessage],
    ['pull_request', generatePullRequestMessage],
    ['commit_comment', generateCommitCommentMessage],
    ['issues', generateIssuesMessage],
    ['issue_comment', generateIssueCommentMessage],
    ['pull_request_review_comment', generatePullRequestReviewCommentMessage],
]);
const generateLarkMessage = (type, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = payload.sender.login;
    const repo = payload.repository.name;
    const timestamp = new Date().getTime().toString().substring(0, 10);
    const sign = (0, GenerateLarkSignatrue_1.default)(timestamp, secret);
    const generateMessage = GithubRequestEvent.get(type);
    if (!generateMessage) {
        throw new Errors_1.ServerError('the server transform webhook failed');
    }
    else {
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
                        tag: 'plain_text',
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
        return (0, node_fetch_1.default)(uri, { method: 'POST', body: JSON.stringify(options) }).then((res) => res.json());
    }
});
// create branch
function generateCreateBranchMessage(payload) {
    const user = payload.sender.login;
    const branch = payload.ref;
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
function generateDeleteBranchMessage(payload) {
    const branch = payload.ref;
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
function generatePushCommitMessage(payload) {
    const branch = payload.ref;
    const commits = payload.commits;
    const created = payload.created;
    const deleted = payload.deleted;
    const forced = payload.forced;
    const elements = commits.reduce((acc, cur, i, arr) => {
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
    }
    else if (deleted) {
        refStatus = 'Branch Deleted';
    }
    else if (forced) {
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
function generatePullRequestMessage(payload) {
    var _a, _b;
    const user = payload.sender.login;
    const action = payload.action; // pull request status
    const content = (_a = payload.pull_request) === null || _a === void 0 ? void 0 : _a.title; // pull content: ;
    const rpUrl = (_b = payload.pull_request) === null || _b === void 0 ? void 0 : _b.html_url; // pull request url
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
function generateCommitCommentMessage(payload) {
    var _a, _b;
    const user = payload.sender.login;
    const comment = (_a = payload.comment) === null || _a === void 0 ? void 0 : _a.body; // comment
    const commentUrl = (_b = payload.comment) === null || _b === void 0 ? void 0 : _b.html_url; // comment url
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
function generateIssuesMessage(payload) {
    var _a, _b;
    const user = payload.sender.login;
    const action = payload.action;
    const issue = (_a = payload.issue) === null || _a === void 0 ? void 0 : _a.title; // issue content
    const issueUrl = (_b = payload.issue) === null || _b === void 0 ? void 0 : _b.html_url; // issue url
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
function generateIssueCommentMessage(payload) {
    var _a, _b, _c;
    const user = payload.sender.login;
    const action = payload.action;
    const issue = (_a = payload.issue) === null || _a === void 0 ? void 0 : _a.title; // issue content
    const comment = (_b = payload.comment) === null || _b === void 0 ? void 0 : _b.body; // issue comment content
    const commentUrl = (_c = payload.comment) === null || _c === void 0 ? void 0 : _c.html_url; // issue comment url
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
                content: action === 'deleted'
                    ? `**${user}** ${action} comment: ${comment}`
                    : `**${user}** ${action} comment: ${comment}\n👉👉👉[点击查看comment详细信息](${commentUrl})`,
            },
        ],
    };
}
// pull request review comment
function generatePullRequestReviewCommentMessage(payload) {
    var _a, _b, _c;
    const user = payload.sender.login;
    const action = payload.action;
    const prContent = (_a = payload.pull_request) === null || _a === void 0 ? void 0 : _a.title;
    const comment = (_b = payload.comment) === null || _b === void 0 ? void 0 : _b.body; // issue comment content
    const commentUrl = (_c = payload.comment) === null || _c === void 0 ? void 0 : _c.html_url; // issue comment url
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
                    content: action === 'deleted'
                        ? `**${user}** deleted pull request review comment: ${comment}\n👉👉👉[点击查看comment详细信息](${commentUrl})`
                        : `**${user}** ${action} pull request review comment: ${comment}\n👉👉👉[点击查看comment详细信息](${commentUrl})`,
                },
            },
        ],
    };
}
exports.default = { generateLarkMessage };
