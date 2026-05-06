# Travel Plan

当前版本：**v2.13.0**

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


## v2.13.0 说明

- 修复中文保存后变成乱码的问题。
- Worker 和前端都使用 UTF-8 安全读写 GitHub `data.json`。
- 读取旧数据时会自动尝试修复常见 UTF-8/Latin-1 双重乱码。
- 人员配置不会再因为乱码清理逻辑误删中文人员。

## v2.13.0 说明

- iOS Safari 添加到主屏幕后以全屏 / PWA 模式打开。
- 新增 `manifest.webmanifest`、`apple-touch-icon.png`、`icon-192.png`、`icon-512.png`。
- 移动端新增安排和语言切换改为悬浮图标按钮，随时可以添加和切换。
- 移动端顶部不再显示重复的“新增安排”按钮。


## v2.13.0 说明

- 删除首页“多设备同步行程”文案。
- 删除首页功能说明文案。
- 标题改为“行程计划 v2.13.0”，删除 Pro 字样。
- 新增安排和语言切换改成全局悬浮图标按钮。
- 移动端不再显示顶部 EN 按钮。
- 清理顶部无用按钮和部分旧样式。


## v2.13.0 说明

- 移动端右下角悬浮按钮缩小，避免遮挡内容。
- 多语言按钮图标改为 A / 文，更明显表示语言切换。
- PC 端日期卡片右上角参与人员样式统一为和表格内相同的小标签。
- 清理上一版重复的悬浮按钮样式覆盖代码。


## v2.13.0 说明

- 修复 iPhone Safari 添加到主屏幕后，全屏模式顶部状态栏遮挡标题的问题。
- 移动端和 PWA 模式增加顶部安全区域 `safe-area-inset-top` 适配。
- 增加横竖屏切换后重新计算安全区域。


## v2.13.0 说明

- 修复移动端打开“新增安排 / 编辑安排”弹窗后，触摸滑动会带动主页面一起滚动的问题。
- 弹窗打开时会锁定背景页面滚动，关闭后恢复到原来的页面位置。
- 编辑弹窗在移动端固定为独立滚动区域，表单内容只在弹窗内部滚动。
- 优化 iOS Safari / 主屏幕 PWA 弹窗下滑时页面漂移的问题。


## v2.13.0 说明

- 移动端编辑 / 新增弹窗改为真正固定定位。
- 使用 JS 写入 `--app-height`，避免 iOS Safari 动态视口变化导致弹窗跳动。
- 增加弹窗内部滚动边界控制，防止滑到顶部或底部时弹窗跟着“弹来弹去”。
- 人员配置、Cloudflare 配置和链接预览弹窗也同步使用固定面板策略。
