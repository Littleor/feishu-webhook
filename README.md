<h1 align="center">
  FeiShu Bot for Github Webhook
</h1>
<p align="center">
<a href="https://github.com/Littleor/feishu-webhook/fork" target="blank">
<img src="https://img.shields.io/github/forks/Littleor/feishu-webhook?style=flat-square" alt="github-profile-readme-generator forks"/>
</a>
<a href="https://github.com/Littleor/feishu-webhook/stargazers" target="blank">
<img src="https://img.shields.io/github/stars/Littleor/feishu-webhook?style=flat-square" alt="github-profile-readme-generator stars"/>
</a>
<a href="https://github.com/Littleor/feishu-webhook/issues" target="blank">
<img src="https://img.shields.io/github/issues/Littleor/feishu-webhook?style=flat-square" alt="github-profile-readme-generator issues"/>
</a>
<a href="https://github.com/Littleor/feishu-webhook/pulls" target="blank">
<img src="https://img.shields.io/github/issues-pr/Littleor/feishu-webhook?style=flat-square" alt="github-profile-readme-generator pull-requests"/>
</a>
</p>

> This repository is a webhook server for github, it will send message to FeiShu group when github webhook trigger.

## Install

```bash
# If you use yarn
yarn

# If you use npm
npm install
```

## Start

### Config the env

You should config the env in ``.env`` file, you can copy the ``.env.example`` file to ``.env`` and modify it.

```
PORT=8090
WORKFLOW_WHITELIST=["completed", "requested"]
FEISHU_URI=https://xxxx     
FEISHU_SECRET=xxxxxxx       
```

> NOTE
> - ``FEISHU_URI`` and ``FEISHU_SECRET`` can get from FeiShu Bot's Webhook URI, you can refer
    to [this document](https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN)
> - ``WORKFLOW_WHITELIST`` is for the workflow_run, it will send message when the workflow_run's status in the list
> - ``PORT`` is the server port

### Build & Run

```bash
yarn build
yarn start
```

### Config the Github WebHook

1. Go to the repository you want to config the webhook
2. Go to ``Settings > Webhooks``
3. Click ``Add webhook``
4. Add the ``Payload URL``(e.g. https://www.example.com/webhook/github)
5. Set ``Content type`` to ``application/json``
6. DO NOT Set ``Secret``
7. Set ``Which events would you like to trigger this webhook?`` to ``Let me select individual events.``
   or ``Send me everything.``
8. Now everything is ok, you can test push the code or create a pull request to test the webhook.

## Support

- Create Branch
- Delete Branch
- Commit Comment
- Pull Request
- Push Commit
- Create Issues
- Issue comment
- Pull request review comment
- Workflow run requested
- Workflow run in_progress
- Workflow run completed

## OPENAPI

To generate new schema file with openapi.yaml, run under folder path

```
npx openapi-typescript openapi.yaml --output ./app/schema/GeneratedSchema.ts
```
