# 喵游

喵游是一款原生 JavaScript 微信小程序，用于管理多目的地旅行。打开小程序默认进入“今日”，让用户在旅行途中第一时间看到当前城市、下一项安排、全天时间线和路线地图；“行程”用于查看整段旅程、城市站点和票券；“花费”用于快速记账与多人结算。

## 当前功能

- 今日：日期切换、下一项安排、全天时间线、交通耗时、预订状态、路线地图
- 行程：整段旅程概览、城市站点、跨城交通、票夹与团体花费入口
- 城市：地图 Pin、类别筛选、城市日程与地点详情
- 票夹：酒店、交通、门票分类与确认状态
- 花费一级 Tab：总额、分类、成员应收应付、最近记录与快速记账
- 地点详情：营业时间、地址、预订状态、共享笔记与打卡清单

## 技术栈

- 微信原生小程序
- JavaScript、WXML、WXSS
- 微信原生 `map` 组件
- 自定义 TabBar
- 本地模拟数据；服务层预留后端与地图 Provider 接口

## 本地运行

1. 安装并打开[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 选择“导入项目”。
3. 项目目录选择本仓库根目录。
4. 使用自己的小程序 AppID；仅预览时也可保留 `project.config.json` 中的 `touristappid`。
5. 编译后默认进入“今日”页。

## 边改边看的浏览器预览

仓库提供一个不依赖微信开发者工具的 H5 预览器，用于快速确认视觉、布局和普通交互：

在线预览：[喵游交互预览](https://htmlpreview.github.io/?https://github.com/clairezhuxz4nf/Meow-Travel-WeChat-Miniprogram/blob/main/preview/index.html)

```bash
python3 -m http.server 4173
```

浏览器打开 `http://localhost:4173/preview/`。预览器支持三个 Tab、日期切换和新增花费。它不是微信运行时，原生 `map`、自定义 TabBar、授权、网络域名和真机兼容性仍需在微信开发者工具中测试。

## 项目结构

```text
miaoyou-miniprogram/
├── docs/                       # 开发与视觉规范
├── miniprogram/
│   ├── components/             # 复用组件
│   ├── custom-tab-bar/         # 今日、行程双 Tab
│   ├── data/                   # 首版模拟数据
│   ├── pages/                  # 页面
│   ├── utils/                  # 日期与格式化工具
│   ├── app.js
│   ├── app.json
│   └── app.wxss
├── scripts/validate.js         # 结构与配置校验
└── project.config.json
```

## 地图与图片

首版使用微信原生 `map` 组件，业务数据通过统一字段驱动，不直接依赖某一家地图服务的 SDK。后续接入 Google Maps、腾讯位置服务或其他 Provider 时，应在服务层完成坐标、地点 ID 与路线结果转换。

生产环境使用远程实拍图片时，需要在微信公众平台配置合法下载域名。视觉层不对照片添加高饱和滤镜，UI 使用低饱和色以保证地图和照片是页面主角。

## 校验

```bash
node scripts/validate.js
```

开发决策见 [微信小程序开发规范](docs/wechat-development-guidelines.md)，视觉规则见 [喵游视觉设计规范](docs/visual-guidelines.md)。

