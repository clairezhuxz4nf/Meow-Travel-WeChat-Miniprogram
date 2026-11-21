# 喵游 · Meow Trip

喵游是一个 mobile-first 的旅行行程网页。当前版本为 Claire 的 2026–2027 欧洲冬日旅行定制，行程数据来自旅行 Notion：罗马 → 佛罗伦萨 → 巴塞罗那 → 巴黎，共 14 天、76 个地点。

## 已实现

- **今日**：14 天日期切换、今日地图、时间线、交通摘要、票券入口
- **行程**：城市切换、按天筛选、地点分类、非当日 Pin 灰显、当日虚线路线
- **地点详情**：时间、备注、票券状态，一键在 Google Maps 打开
- **票券夹**：展示当天需要出示或购买的票券
- **花费**：多币种总览、分类统计、成员结算提示、新增记账；数据保存在本机
- **PWA**：可安装、基础离线壳缓存
- **旧版微信小程序原型**：仍保留在 `miniprogram/`，方便后续迁移

地图使用 Leaflet + OpenStreetMap；Google Maps 只用于外部地点导航，因此无需 Google Maps API key。行程目前是静态 JavaScript 数据，不包含 Notion 中的预订码或私人票据。

## 在线预览

[打开喵游交互预览](https://htmlpreview.github.io/?https://github.com/clairezhuxz4nf/Meow-Travel-WeChat-Miniprogram/blob/main/preview/index.html)

预览文件由 `npm run build` 自动打成单个 HTML，不依赖 GitHub Pages 仓库设置。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开终端显示的地址。建议使用 Chrome DevTools 的 iPhone 视口测试。

## 校验与构建

```bash
npm run check
npm run build
```

`npm run check` 会校验 14 天、城市关联和所有坐标；`npm run build` 生成 `dist/`。

## 项目结构

```text
├── src/
│   ├── data/trip.js       # 14 天静态行程、坐标、票券与初始花费
│   ├── main.js            # 页面、地图和交互
│   └── styles.css         # 喵游低饱和手绘视觉系统
├── public/                # PWA manifest 与 service worker
├── miniprogram/           # 旧版微信小程序原型
├── preview/               # 旧版静态预览
├── docs/                  # 视觉与微信开发规范
└── preview/index.html     # 可直接分享的单文件交互预览
```

## 数据与隐私

- 公开仓库只保存通用行程，不保存 Booking code、护照、订单 PDF 或二维码。
- 当前新增花费写入浏览器 `localStorage`，不会上传。
- `.env.example` 仅预留后续 Supabase 与 OpenRouteService 配置；首版不依赖后端。
- 票据文件后续应存入私有对象存储，不应提交到 Git。

视觉规范见 [docs/visual-guidelines.md](docs/visual-guidelines.md)。
