# remote-invoker
Absolute simply tool using for remote invoke system command without ssh login. For example it can be used in github CI/CD


This server requires file config.json

Example of config.json

```javascript
{
  "port": "8080",
  "magic-token-header": "My-Own-Header",
  "magic-token": "1234567890",
  "endpoint": "/secret-endpoint",
  "commands": [
    "echo welcome in my server",
    "mkdir folder",
  ]
}

```

Example of starting this server

```
node invoker.mjs
```
