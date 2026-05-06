# Travel Plan Pro

当前版本：**v2.3.1**

## 本版更新

- Cloudflare 同步配置里的 `APP_PASSWORD` 会按要求保存到 `data.json`：

```json
{
  "settings": {
    "cloudflare": {
      "apiBase": "https://你的-worker.workers.dev",
      "appPassword": "你的写入密码"
    }
  }
}
```

- Worker 已兼容你截图里的 Cloudflare Variables and Secrets：
  - `APP_PASSWORD`：Secret，写入密码
  - `DATA_PATH`：Plaintext，例如 `data.json`
  - `GH_BRANCH`：Plaintext，例如 `main`
  - `GH_OWNER`：Plaintext，例如 `evanlliu`
  - `GH_REPO`：Plaintext，例如 `travel-plan`
  - `GH_TOKEN`：Secret，GitHub Token
- Worker 优先使用 GitHub 仓库里的 `data.json` 作为同步存储；如果没有配置 GitHub，则兼容旧版 KV：`TRAVEL_DATA`。

## 重要提醒

`APP_PASSWORD` 放到 `data.json` 后，任何能访问 `data.json` 或 Worker GET 地址的人都可能看到这个密码。你这版是按要求实现的。如果后面想更安全，可以再改回“只放 Cloudflare Secret，不写入 data.json”。

## Cloudflare Variables and Secrets 配置

进入：

```text
Workers & Pages → 你的 Worker → Settings → Variables and Secrets
```

按你的截图这样添加即可：

| Type | Name | Value |
|---|---|---|
| Secret | APP_PASSWORD | 你的写入密码 |
| Plaintext | DATA_PATH | data.json |
| Plaintext | GH_BRANCH | main |
| Plaintext | GH_OWNER | evanlliu |
| Plaintext | GH_REPO | travel-plan |
| Secret | GH_TOKEN | 你的 GitHub token |

`GH_TOKEN` 建议使用 Fine-grained token，并给目标仓库 `Contents: Read and write` 权限。

## 前端配置

打开网页后：

```text
更多功能 → Cloudflare 同步配置
```

填写：

```text
Worker 地址：https://你的-worker.workers.dev
写入密码：和 Cloudflare Secret APP_PASSWORD 一样
```

保存后，会写入 `data.json` 的：

```text
settings.cloudflare.apiBase
settings.cloudflare.appPassword
```

## GitHub 仓库文件

把这些文件放到你的 GitHub Pages / Cloudflare Pages 仓库：

```text
index.html
style.css
app.js
data.json
```

Worker 单独部署：

```text
worker.js
wrangler.toml
```

## Excel 表头

中文：

```text
日期, 时间, 分组, 计划内容, 小红书链接, 参与人员
```

英文：

```text
Date, Time, Group, Plan Content, Red Note, People
```
