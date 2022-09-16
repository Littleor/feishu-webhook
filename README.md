# feishu webhook

## install

```
yarn or npm i
```

## start

```
yarn start or npm start
```

port: 9001

## webhook 设置

1. Repository>Settings>Webhooks
2. Add webhook
3. Add Payload URL(e.g. https://www.example.com/push/)
4. Content type set to ``application/json``
5. Send me everything when trigger this webhook


## 飞书相关

- https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN
- 添加机器人时，打开安全设置的签名校验，并将``密钥``添加至 config.json secret 中。

### 支持类型
- create branch
- delete branch
- commit comment
- pull request
- push commit

