# Travel Plan Web v2.43.24

## v2.43.24 说明

- 新增每天日期卡片的折叠 / 展开功能。
- 默认所有日期卡片展开；手动折叠某一天后，会写入 `data.json` 的 `settings.dayCollapsed`。
- 下次打开页面、刷新页面或在新设备同步后，已折叠的日期仍保持折叠，方便专注后续日期计划。
- PC 和移动端都支持折叠按钮，移动端使用更小的图标按钮，避免占用行程空间。

## 部署说明

- GitHub Pages 需要更新：`index.html`、`app.js`、`style.css`、`data.json`、`README.md`、`CHANGELOG.md`。
- Cloudflare Worker 需要更新：`worker.js`。
