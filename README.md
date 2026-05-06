# Travel Plan Pro

当前版本：**v2.0.0**

## 功能

- PC / iPhone 移动端兼容
- 中英文界面切换
- 按日期分组展示行程
- 支持时间、分组、计划内容、小红书链接、参与人员
- 支持 Excel 导入和模板下载
- 支持人员配置和下拉多选
- 支持小红书链接弹窗预览
- 支持 Cloudflare Worker + KV 多设备同步

## 部署

1. 把 `index.html`、`style.css`、`app.js` 和 `data.json` 放到 GitHub 仓库。
2. 用 Cloudflare Pages 连接 GitHub 仓库。
3. 部署 `worker.js`，并配置 KV Namespace。
4. 在 `app.js` 里把 `apiBase: ""` 改成你的 Worker 地址。

## Excel 表头

中文：

```text
日期, 时间, 分组, 计划内容, 小红书链接, 参与人员
```

英文：

```text
Date, Time, Group, Plan Content, Red Note, People
```
