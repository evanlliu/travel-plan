# Travel Plan Web v2.43.30

## v2.43.30 说明

- 优化移动端当前计划工具栏布局。
- “全部折叠 / 全部展开 / 查询”三个图标按钮改为紧凑右对齐，按钮之间距离更近。
- 当前计划名称区域自动占用左侧剩余空间，不再把折叠/展开按钮挤到中间。
- PC 端保持原布局逻辑，移动端重点修复右侧按钮组对齐问题。

## 部署说明

- GitHub Pages 需要更新：`index.html`、`app.js`、`style.css`、`README.md`、`CHANGELOG.md`。
- Cloudflare Worker 建议更新：`worker.js`，本次主要同步版本号。
- `data.json` 只在你确认线上数据没有更新时再覆盖；线上数据较新时不要直接覆盖。
