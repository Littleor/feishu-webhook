# feishu webhook

## install

```
yarn or npm i
```

## start

```
yarn start or npm start
```

port: 8090

## webhook 设置

1. Repository > Settings > Webhooks
2. Add Webhook
3. Add Payload URL(e.g. https://www.example.com/webhook/github)
4. Content type set to ``application/json``
5. Send me everything when trigger this webhook


## 飞书相关

- https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN

### 支持类型
- create branch
- delete branch
- commit comment
- pull request
- push commit
- issues
- issue comment
- pull request review comment

## OPENAPI

### Generate new schema file with openapi.yaml, run under folder path
```
npx openapi-typescript openapi.yaml --output ./app/schema/GeneratedSchema.ts
```

### 其他

-  node-fetch 使用*2.6.5*版本,
