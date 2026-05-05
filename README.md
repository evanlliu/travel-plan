# Travel Plan Web

功能：PC 表格 + iOS 移动端卡片、中文/英文界面切换、Excel 中文/英文模板导入、在线编辑、小红书链接弹窗、多选参与人员、人员配置、多设备同步。

## 文件说明

- `index.html`：前端页面，jQuery + SheetJS，无需构建。
- `data.json`：初始数据模板。未配置 Worker 时只能读取/本地保存。
- `worker.js`：Cloudflare Worker API，用 KV 的 `data.json` key 存储完整 JSON。
- `wrangler.toml`：Worker 部署配置。

## 重要说明

纯 GitHub/Cloudflare Pages 静态网页不能直接修改仓库里的 `data.json` 文件，所以多设备同步必须走一个后端 API。这里使用 Cloudflare Worker + KV 保存一个名为 `data.json` 的 JSON 数据。

## 部署步骤

### 1. 上传前端到 GitHub

把 `index.html` 和 `data.json` 放到一个 GitHub 仓库根目录。

### 2. Cloudflare Pages 绑定 GitHub

在 Cloudflare Pages 新建项目，连接 GitHub 仓库。这个项目没有构建步骤，输出目录保持 `/` 或默认即可。

### 3. 部署 Worker

安装并登录 Wrangler 后：

```bash
npm install -g wrangler
wrangler login
cd travel-plan-web
wrangler kv namespace create TRAVEL_DATA
```

把命令返回的 `id` 填进 `wrangler.toml` 的 `id = "..."`。

设置写入密码，防止别人乱改数据：

```bash
wrangler secret put APP_PASSWORD
```

部署 Worker：

```bash
wrangler deploy
```

### 4. 连接前端和 Worker

打开 `index.html`，把：

```js
apiBase: ""
```

改成你的 Worker 地址，例如：

```js
apiBase: "https://travel-plan-api.yourname.workers.dev"
```

提交到 GitHub，Cloudflare Pages 会自动重新部署。

### 5. 使用

首次保存时会提示输入 `APP_PASSWORD`。同一个浏览器会在本次会话里记住密码。其他设备打开同一个 Pages 地址后，会从 Worker 读取同一份 `data.json` 数据。

## Excel 导入表头

中文模板：

```text
语言, 日期, 星期, 计划内容, 小红书链接, 参与人员
```

英文模板：

```text
Language, Date, Weekday, Plan Content, Xiaohongshu Link, Participants
```

多个小红书链接建议一行一个。参与人员可用英文逗号、中文逗号、分号或换行分隔。
