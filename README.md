# Travel Plan Web v2.30.0

一个轻量级行程计划网页，支持 PC、移动端 Safari、iPhone 添加到主屏幕后使用。

## 功能

- 中英文切换
- 按日期自动分组展示行程
- 日期选择后自动带出星期
- 新增、编辑、删除行程
- 参与人员多选和人员配置
- 小红书链接弹窗预览
- Excel 导入
- 中文 / 英文 Excel 模板导出
- Cloudflare Worker + GitHub `data.json` 多设备同步
- 普通 Safari 和添加到主屏幕后 PWA 模式适配

## 文件说明

```text
index.html              页面结构
style.css               样式和 PC / 移动端适配
app.js                  前端逻辑
data.json               行程数据、人员配置、Cloudflare 配置
worker.js               Cloudflare Worker 同步接口
wrangler.toml           Worker 配置示例
manifest.webmanifest    PWA 配置
icon-192.png            PWA 图标
icon-512.png            PWA 图标
apple-touch-icon.png    iOS 主屏幕图标
```

## GitHub Pages 部署

把以下文件放到 GitHub Pages 仓库根目录：

```text
index.html
style.css
app.js
data.json
manifest.webmanifest
icon-192.png
icon-512.png
apple-touch-icon.png
```

浏览器访问你的 GitHub Pages 地址即可。

## Cloudflare Worker 配置

Worker 需要部署：

```text
worker.js
wrangler.toml
```

Cloudflare Worker 的 Variables and Secrets 建议这样配置：

| Type | Name | Value |
|---|---|---|
| Secret | APP_PASSWORD | 你的写入密码 |
| Plaintext | DATA_PATH | data.json |
| Plaintext | GH_BRANCH | main |
| Plaintext | GH_OWNER | GitHub 用户名 |
| Plaintext | GH_REPO | GitHub 仓库名 |
| Secret | GH_TOKEN | GitHub Personal Access Token |

`APP_PASSWORD` 也会通过前端 Cloudflare 同步配置保存到 `data.json` 的：

```text
settings.cloudflare.appPassword
```

这样新设备加载 `data.json` 后，也能读取 Worker 地址和密码配置。

## 使用说明

1. 打开网页。
2. 点右下角 `+` 新增安排。
3. 点右下角语言按钮切换中英文。
4. 点“更多功能”可以导入 Excel、导出模板、配置人员、配置 Cloudflare。
5. 配置 Cloudflare 后，新增、编辑、删除、人员配置都会同步写入 GitHub 的 `data.json`。

## v2.30.0 界面优化

- PC 端改为更紧凑的行程表格：减少卡片空白、缩小按钮和标签，让一屏显示更多安排。
- 移动端改为时间轴式紧凑卡片：时间固定在左侧，计划内容优先显示，链接和人员作为辅助信息显示。
- 每天标题增加摘要：时间范围、参与人数、链接数量，方便快速抓重点。
- 空链接 / 空人员在移动端隐藏，减少无效信息占位。
- 小红书链接改为胶囊按钮，避免长链接占用太多宽度。


## v2.30.0 说明

- PC 端整体密度继续压缩：卡片、表格、按钮、人员标签、链接标签都更紧凑。
- 移动端整体内容继续缩小：时间轴行、卡片间距、标签、链接胶囊都更小。
- 编辑弹窗同步压缩间距，但移动端输入框字体保持 16px，避免 iOS Safari 自动放大页面。
- 右下角悬浮按钮继续缩小，减少遮挡内容。


## v2.30.0 说明

- 顶部三个信息卡片进一步压缩：标题卡片、搜索卡片、数据状态卡片更矮。
- 卡片之间的上下间隔减少，让日期行程卡片更靠上。
- PC 端数据状态改为单行显示，减少占用高度。
- 移动端顶部信息继续缩小，优先展示下面的日期行程内容。
