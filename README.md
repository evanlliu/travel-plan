# Travel Plan Pro

当前版本：**v2.6.0**

## 本版修复

1. 修复人员配置里的乱码人员重复出现问题。
   - 自动过滤 `Ã`、`Â`、控制字符、替换字符等常见乱码。
   - 保存人员配置时，会同步清理行程中的已删除人员，避免下次加载又被重新添加。
2. 重新优化移动端兼容。
   - 顶部按钮、更多功能、弹窗、行程表格在 iPhone Safari 上重新适配。
3. 新增安排日期改为第三方日期插件 `flatpickr`。
   - 一个输入框直接选择日期。
   - 支持中文 / 英文日历。
   - 切换语言后，日历月份、星期、显示格式会跟着切换。
4. Cloudflare 同步配置、人员配置都会保存到 `data.json`。
   - `settings.cloudflare.apiBase`
   - `settings.cloudflare.appPassword`
   - `peopleOptions`

## Cloudflare Worker 配置

你的截图配置可以继续使用：

| Type | Name | Value |
|---|---|---|
| Secret | `APP_PASSWORD` | 你的写入密码 |
| Secret | `GH_TOKEN` | GitHub Token |
| Plaintext | `DATA_PATH` | `data.json` |
| Plaintext | `GH_BRANCH` | `main` |
| Plaintext | `GH_OWNER` | `evanlliu` |
| Plaintext | `GH_REPO` | `travel-plan` |

`worker.js` 兼容路径：

```text
/
 /data
 /data.json
```

页面里的 Worker 地址可以填写：

```text
https://你的-worker.workers.dev
```

也兼容：

```text
https://你的-worker.workers.dev/data
https://你的-worker.workers.dev/data.json
```

## 部署

1. 将这些文件上传到 GitHub 仓库：
   - `index.html`
   - `style.css`
   - `app.js`
   - `data.json`
   - `worker.js`
   - `wrangler.toml`
2. Cloudflare Pages 连接该仓库。
3. Cloudflare Worker 部署新版 `worker.js`。
4. 打开网页，在“更多功能 -> Cloudflare 同步配置”里保存 Worker 地址和 APP_PASSWORD。
5. 保存后配置会写入 GitHub 的 `data.json`，新设备加载后会自动同步。

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

按你的要求，`APP_PASSWORD` 会保存到 `data.json`。这样换设备方便同步，但如果别人能访问 `data.json`，也能看到这个密码。
