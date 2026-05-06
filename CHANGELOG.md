# Changelog

## v2.4.0

- 修复并强化 Cloudflare 同步配置保存逻辑。
- Worker 地址保存到 `data.json -> settings.cloudflare.apiBase`。
- APP_PASSWORD 保存到 `data.json -> settings.cloudflare.appPassword`。
- 新设备首次打开时会先读取静态 `data.json`，再自动请求 Worker `/data.json` 同步最新数据。
- 每次页面加载和重新回到页面时都会尝试同步 Worker `/data.json`。

## v2.4.0

- 按要求将 `APP_PASSWORD` 也保存到 `data.json` 的 `settings.cloudflare.appPassword`。
- Worker 兼容 GitHub 存储模式：`GH_OWNER`、`GH_REPO`、`GH_BRANCH`、`DATA_PATH`、`GH_TOKEN`。
- Worker 继续兼容旧版 KV 存储模式：`TRAVEL_DATA`。
- README 更新 Cloudflare Variables and Secrets 配置说明。

## v2.2.0

- Cloudflare Worker 地址保存到 `data.json`。
- 顶部统计卡片删除。
- 除新增外的按钮折叠到更多功能。
- 日期选择器改为自定义中英文显示。

## v2.1.0

- 优化 Cloudflare 配置弹窗。
- 优化移动端界面。

## v2.0.0

- 全新日期分组式界面。
- 支持 PC / 移动端自适应。
- 支持中英文界面切换。
- 支持 Excel 导入和模板下载。
- 支持小红书链接弹窗预览。
- 支持人员下拉多选与人员配置。
