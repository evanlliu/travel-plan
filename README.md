# Travel Plan Pro v2.5.0

## 本版本重点

- 人员配置 `peopleOptions` 会保存到 `data.json`。
- Cloudflare Worker 地址和 `APP_PASSWORD` 会保存到 `data.json` 的 `settings.cloudflare`。
- 每次设备打开页面时，会先读取当前站点的 `./data.json`，再用里面的 Cloudflare 配置同步 Worker 最新数据。
- 支持你截图里的 Cloudflare Worker GitHub 模式变量：
  - Secret: `APP_PASSWORD`
  - Secret: `GH_TOKEN`
  - Plaintext: `GH_OWNER`
  - Plaintext: `GH_REPO`
  - Plaintext: `GH_BRANCH`
  - Plaintext: `DATA_PATH`
- 仍兼容 KV 绑定 `TRAVEL_DATA`。

## data.json 关键结构

```json
{
  "version": "v2.5.0",
  "settings": {
    "cloudflare": {
      "apiBase": "https://your-worker.workers.dev",
      "appPassword": "your-password",
      "configSavedInDataJson": true,
      "passwordStorage": "data.json settings.cloudflare.appPassword"
    }
  },
  "peopleOptions": ["Evan", "Gonca"],
  "items": []
}
```

## 部署方式

1. 把 `index.html`、`style.css`、`app.js`、`data.json` 上传到 GitHub 仓库。
2. Cloudflare Pages 连接这个 GitHub 仓库。
3. Cloudflare Worker 使用 `worker.js`。
4. Worker 的 Variables and Secrets 按下面配置：
   - `APP_PASSWORD`：Secret，写入密码。
   - `GH_TOKEN`：Secret，GitHub Token，需要 Contents read/write 权限。
   - `GH_OWNER`：Plaintext，例如 `evanlliu`。
   - `GH_REPO`：Plaintext，例如 `travel-plan`。
   - `GH_BRANCH`：Plaintext，例如 `main`。
   - `DATA_PATH`：Plaintext，例如 `data.json`。

## Excel 表头

中文：

```text
日期, 时间, 分组, 计划内容, 小红书链接, 参与人员
```

英文：

```text
Date, Time, Group, Plan Content, Red Note, People
```

## 注意

按你的要求，本版本会把 `APP_PASSWORD` 保存到 `data.json`。这样新设备同步更方便，但能访问 `data.json` 的人也能看到这个密码。
