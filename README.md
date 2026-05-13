# Travel Plan Web v2.43.26

## v2.43.26 说明

- “全部折叠 / 全部展开”改成和查询按钮一致的方形图标按钮。
- 两个按钮与当前计划下拉、查询按钮保持同一行，PC 和移动端都不会被挤到下一行。
- 移动端隐藏较长的计划日期摘要，优先保证当前计划下拉和三个图标按钮同排显示。
- 折叠状态继续保存到 `data.json` 的 `settings.dayCollapsed`，刷新、重新打开或新设备同步后保持一致。

## 部署说明

- GitHub Pages 需要更新：`index.html`、`app.js`、`style.css`、`README.md`、`CHANGELOG.md`。
- Cloudflare Worker 建议更新：`worker.js`，本次仅同步版本号，折叠状态保留逻辑沿用之前版本。
