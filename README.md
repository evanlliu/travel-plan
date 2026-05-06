# Travel Plan Pro

当前版本：**v2.1.0**

## v2.1.0 更新内容

1. 新增 **Cloudflare 同步自定义配置**
   - 页面中直接打开“Cloudflare 同步配置”
   - 可填写 Worker 地址
   - 可填写写入密码 APP_PASSWORD
   - 可测试读取
   - 配置保存在当前设备浏览器 localStorage，不需要每次改代码

2. 删除顶部统计卡片栏
   - 去掉天数、安排数、链接数、参与人数卡片
   - 页面更干净

3. 按钮折叠优化
   - 顶部只保留“新增安排”和“更多功能”
   - 导入、模板、人员配置、Cloudflare、刷新同步都放入折叠面板
   - 移动端更清爽

4. 日期选择器多语言优化
   - 不再使用浏览器原生 `input type=date`
   - 改成自定义年 / 月 / 日选择器
   - 中文模式显示：2026年、5月、17日
   - 英文模式显示：2026、May、17
   - 星期会根据选择日期自动计算，并跟随语言切换

5. 继续兼容 PC 和移动端，尤其是 iPhone / iOS Safari。

## 文件说明

- `index.html`：页面结构
- `style.css`：界面样式
- `app.js`：前端逻辑，jQuery + SheetJS
- `data.json`：初始数据
- `worker.js`：Cloudflare Worker API
- `wrangler.toml`：Worker 部署配置
- `CHANGELOG.md`：版本记录

## Cloudflare 同步配置方式

### 1. 部署 Worker

```bash
npm install -g wrangler
wrangler login
cd travel-plan-web
wrangler kv namespace create TRAVEL_DATA
```

把返回的 KV Namespace ID 填到 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "TRAVEL_DATA"
id = "你的 KV ID"
```

设置写入密码：

```bash
wrangler secret put APP_PASSWORD
```

部署：

```bash
wrangler deploy
```

### 2. 前端页面配置

打开网页后：

```text
更多功能 -> Cloudflare 同步配置
```

填写：

```text
Worker 地址：https://你的-worker.workers.dev
写入密码：你设置的 APP_PASSWORD
```

保存后，页面就会使用 Cloudflare Worker + KV 多设备同步。

## Excel 模板表头

中文：

```text
日期, 时间, 分组, 计划内容, 小红书链接, 参与人员
```

英文：

```text
Date, Time, Group, Plan Content, Red Note, People
```

## 导入说明

- 日期支持：`2026-05-17`、`5月17日`、`2026年5月17日`、`May 17`、`17-May`
- 时间支持：`13:00`
- 分组支持：`Plan 1`、`Plan 2`
- 日期为空时，会沿用上一行日期
- 参与人员为空时，会沿用上一行参与人员

## 注意

如果不配置 Cloudflare，数据只会保存在当前浏览器 localStorage，不能多设备同步。
