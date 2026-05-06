# Travel Plan Web v2.41.0

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

## v2.41.0 界面优化

- PC 端改为更紧凑的行程表格：减少卡片空白、缩小按钮和标签，让一屏显示更多安排。
- 移动端改为时间轴式紧凑卡片：时间固定在左侧，计划内容优先显示，链接和人员作为辅助信息显示。
- 每天标题增加摘要：时间范围、参与人数、链接数量，方便快速抓重点。
- 空链接 / 空人员在移动端隐藏，减少无效信息占位。
- 小红书链接改为胶囊按钮，避免长链接占用太多宽度。


## v2.41.0 说明

- PC 端整体密度继续压缩：卡片、表格、按钮、人员标签、链接标签都更紧凑。
- 移动端整体内容继续缩小：时间轴行、卡片间距、标签、链接胶囊都更小。
- 编辑弹窗同步压缩间距，但移动端输入框字体保持 16px，避免 iOS Safari 自动放大页面。
- 右下角悬浮按钮继续缩小，减少遮挡内容。


## v2.41.0 说明

- 顶部三个信息卡片进一步压缩：标题卡片、搜索卡片、数据状态卡片更矮。
- 卡片之间的上下间隔减少，让日期行程卡片更靠上。
- PC 端数据状态改为单行显示，减少占用高度。
- 移动端顶部信息继续缩小，优先展示下面的日期行程内容。


## v2.41.0 说明

- 小红书 / Red Note 链接点击后直接新窗口打开。
- 取消 iframe 弹窗预览逻辑，避免弹窗遮挡页面。
- 导入或手动录入的链接会自动使用 `target="_blank"` 和 `rel="noopener noreferrer"`。


## v2.41.0 说明

- 每条行程记录新增 Copy / 复制按钮。
- 按钮位置：Edit / 编辑 后面，Delete / 删除 前面。
- 点击复制后会新增一条相同的行程记录，保留日期、时间、分组、计划内容、小红书链接和参与人员。
- 为了避免三按钮占空间，PC 和移动端的操作按钮都做了紧凑化处理。


## v2.41.0 说明

- 每条记录的 Edit / Copy / Delete 三个按钮强制同一行显示。
- PC 端加宽 Action 列，同时缩小按钮间距和按钮尺寸。
- 移动端也保持三按钮横向排列；极窄屏下允许按钮区域横向微滚动，避免挤到下一行。


## v2.41.0 说明

- 移动端新增 / 编辑页面改成一屏紧凑布局。
- 日期和时间一行显示，星期和参与人员一行显示。
- 计划内容、小红书链接高度压缩，提示说明隐藏。
- 底部 Cancel / Save 改为普通表单底部按钮，不再占用额外滚动空间。
- People 选择改为悬浮在选择框下方，不再把表单撑高。


## v2.41.0 说明

- 移动端新增 / 编辑页面改为真正全屏，而不是小卡片浮层。
- 页面视觉重新优化：顶部、表单、底部按钮分区更清楚。
- 计划内容是核心输入项，已放大高度和字体，让用户更直观看到重点。
- 日期/时间、星期/人员保持双列，减少空间浪费。
- People 下拉继续悬浮，不撑高页面。


## v2.41.0 说明

- 移动端编辑页改为单列全屏表单，每个填写项独占一行。
- 页面高度会被完整利用，不再出现大片空白。
- 计划内容区域会自适应吃掉剩余空间，并保持最大的可编辑区域。
- 默认不滚动；只有极小屏幕或键盘弹出时才允许必要滚动。


## v2.41.0 说明

- 移动端编辑页继续优化全屏填充。
- Plan Content 输入框改为自适应高度，占用主要剩余空间。
- Red Note 输入框也改为自适应高度，并比上一版更高。
- 表单会按屏幕高度自动分配 Plan Content 和 Red Note 的高度，尽量刚好填满整个屏幕。


## v2.41.0 说明

- PC 端卡片之间的间隔继续缩短。
- 顶部标题、搜索、状态卡片之间的距离减少。
- 日期卡片之间的距离减少。
- 行程记录之间的间隔也略微压缩，让一屏显示更多内容。


## v2.41.0 说明

- PC 端顶部三个卡片间隔继续缩小。
- 日期卡片外边距和内边距继续压缩。
- 行程记录行距、行高、按钮尺寸进一步缩小。
- 一屏可见内容更多，重点展示日期卡片和行程内容。


## v2.41.0 说明

- PC 端下面日期卡片之间的间距继续缩小。
- 只重点压缩日期卡片外部间隔，尽量不影响卡片内部行程内容可读性。


## v2.41.0 说明

- 每条行程新增「必做 / 可选」类型。
- 日期卡片顶部会统计当天 Must do / Optional 数量。
- 行程内容前方显示类型标签，不额外增加表格列，节省空间。
- 新增 / 编辑页面增加类型切换按钮。
- Excel 导入模板新增类型列，支持中文「必做 / 可选」和英文「Must do / Optional」。
- 兼容旧 data.json：旧记录没有类型字段时默认按「必做」处理。
