# 喵游微信小程序开发规范

## 依据

项目遵循微信官方小程序的原生项目结构与配置方式：

- [小程序快速开始](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/)
- [全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)
- [页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)
- [自定义 TabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)
- [Map 组件](https://developers.weixin.qq.com/miniprogram/dev/component/map.html)

## 工程约定

- 使用原生 JavaScript、WXML、WXSS，不引入跨端框架。
- `app.json` 只承担全局页面注册、窗口与 TabBar 配置。
- 每个页面由同名的 `.js`、`.json`、`.wxml`、`.wxss` 四个文件组成。
- 可复用 UI 放入 `components`，跨页面数据转换放入 `utils` 或服务层。
- 页面不直接拼装第三方地图请求；所有 Provider 数据先转换为统一地点模型。
- 不在代码中保存 AppSecret、地图密钥或生产接口凭证。
- 所有远程接口必须使用 HTTPS，并在微信公众平台配置合法域名。

## 页面与导航

一级导航保留“今日”“行程”和“花费”。

- 今日：默认入口，服务旅行中的高频即时查看。
- 行程：整段旅程规划、城市组织及管理入口。
- 花费：高频记账、成员结算和分类统计。
- 城市、地点和票夹为二级页面，使用 `wx.navigateTo` 进入。
- 一级 Tab 使用 `wx.switchTab`，不得使用 `navigateTo`。
- 页面层级控制在三层以内，避免用户在旅行途中迷失。

## 页面生命周期

- `onLoad`：解析页面参数并建立一次性数据。
- `onShow`：刷新 Tab 选中态及可能变化的业务数据。
- `onPullDownRefresh`：仅用于有远程刷新意义的页面。
- `onUnload`：清理定时器、监听器和临时资源。
- 不在 `onShow` 中重复创建重量级对象或发起无法去重的请求。

## 数据模型

统一地点对象至少包含：

```js
{
  id,
  name,
  category,
  latitude,
  longitude,
  address,
  photoUrl,
  provider,
  providerPlaceId
}
```

时间使用 ISO 日期 `YYYY-MM-DD` 与 24 小时制 `HH:mm`。金额以最小货币单位或明确的货币代码存储，展示层负责格式化。

## 地图规范

- 使用 `latitude`、`longitude`、`markers` 与 `polyline` 驱动地图。
- Marker ID 必须为稳定数字，业务 ID 另行保存映射。
- 地图服务商署名、比例尺与 Logo 不得被浮层遮挡。
- 同屏 Marker 过多时使用聚合或列表，不一次渲染全部地点。
- 地图同时提供地点列表入口，保证弱网与无障碍场景可用。
- Google Maps 等境外服务需评估用户所在地的网络可用性；Provider 必须可替换。

## 性能规范

- 首屏仅加载今日必要数据，完整行程按页面进入时加载。
- 图片使用合适尺寸和裁切模式，列表图不加载原始大图。
- 长列表使用分页、分段或虚拟化；避免一次性 setData 大对象。
- `setData` 只提交发生变化的字段，不把整个页面状态重复下发。
- 地图 Marker 和折线按当前城市、日期和筛选条件生成。

## 隐私与权限

- 首版不主动申请定位；只有用户使用“定位到我”时才触发授权。
- 请求位置、相册等权限前先解释用途。
- 团体花费只展示旅程成员所需信息，不存储支付账户或银行卡数据。
- 日志不得记录票券二维码、确认码、精确位置历史或密钥。

## 状态与容错

每个远程页面都应具备加载中、空数据、失败和离线四种状态。地图失败时保留地点列表；图片失败时显示类别占位；票券二维码加载失败时保留确认码文字入口。

## 发布前检查

- `app.json` 页面路径与实际文件一致
- TabBar 页面使用 `switchTab`
- AppID、请求域名与下载域名配置正确
- 隐私接口声明与实际权限调用一致
- 地图署名无遮挡
- 关键操作在弱网、强光、长文本和大字体下可用
- 不包含测试密钥、个人数据和生产票券信息

