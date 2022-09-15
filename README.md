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

## 添加机器人

- 添加机器人时取号改机器人对应的仓库名称，如：rsp-game repository 对应 web，rps-server repository 对应 backend
- :repository 对应 config 中 urls/secrets 的键值

## 签名校验

- 添加机器人时，打开安全设置的签名校验，并将``密钥``添加至 config.json secrets 中。


## webhook 设置

1. Repository>Settings>Webhooks
2. Add webhook
3. Add Payload URL(e.g. https://www.example.com/push/:repository)
4. Content type set to ``application/json``
5. Send me everything when trigger this webhook
