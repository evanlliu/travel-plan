# Changelog

## v2.5.0

- 新增：人员配置保存到 `data.json` 的 `peopleOptions`。
- 新增：保存人员配置后会直接同步到 Worker / GitHub 的 `data.json`。
- 优化：设备启动流程，先读取本地站点 `./data.json`，再使用其中的 Cloudflare 地址和密码同步 Worker 数据。
- 优化：Cloudflare 配置保存到 `data.json` 的 `settings.cloudflare`，包含 `apiBase` 和 `appPassword`。
- 优化：兼容 Worker 地址根路径、`/data`、`/data.json`。
- 保留：中英文 UI、移动端适配、自定义日期选择器、Excel 导入、人员多选、小红书链接预览。
