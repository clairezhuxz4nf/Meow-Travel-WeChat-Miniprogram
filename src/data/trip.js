export const trip = {
  id: 'europe-2026-winter',
  name: 'Europe Trip',
  subtitle: '四城冬日漫游',
  startDate: '2026-12-27',
  endDate: '2027-01-09',
  travelers: ['Claire', 'Chase'],
  cities: [
    { id: 'rome', name: '罗马', country: '意大利', dates: '12/27–12/30', center: [41.8986, 12.4828], zoom: 13, color: '#c86b4a' },
    { id: 'florence', name: '佛罗伦萨', country: '意大利', dates: '12/30–1/2', center: [43.7713, 11.2555], zoom: 13, color: '#d9a441' },
    { id: 'barcelona', name: '巴塞罗那', country: '西班牙', dates: '1/2–1/5', center: [41.3927, 2.1662], zoom: 13, color: '#6f9c91' },
    { id: 'paris', name: '巴黎', country: '法国', dates: '1/5–1/9', center: [48.8654, 2.3238], zoom: 12, color: '#6d87a8' }
  ],
  stays: [
    { cityId: 'rome', name: 'DoubleTree by Hilton Rome Monti', shortName: '罗马酒店', dates: '12/27–12/30', coords: [41.8978, 12.4988], type: 'hotel', status: 'confirmed' },
    { cityId: 'florence', name: 'Anglo American Hotel Florence', shortName: '佛罗伦萨酒店', dates: '12/30–1/2', coords: [43.7781, 11.2388], type: 'hotel', status: 'confirmed' },
    { cityId: 'barcelona', name: 'Via Sants Hotel Barcelona', shortName: '巴塞罗那酒店', dates: '1/2–1/5', coords: [41.3788, 2.1412], type: 'hotel', status: 'confirmed' },
    { cityId: 'paris', name: 'Niepce Paris Hotel', shortName: '巴黎酒店', dates: '1/5–1/9', coords: [48.8337, 2.3157], type: 'hotel', status: 'confirmed' },
    { cityId: 'paris', name: 'Hyatt Regency Paris Étoile', shortName: '凯悦酒店', dates: '1/6–1/8', coords: [48.8806, 2.2846], type: 'hotel', status: 'confirmed' }
  ]
};

const p = (name, shortName, type, coords, time, extra = {}) => ({ name, shortName, type, coords, time, ...extra });

export const days = [
  {
    number: 1, date: '2026-12-27', label: '12/27 · 周日', cityId: 'rome', icon: '🛬', title: '傍晚抵达罗马',
    weather: '抵达日 · 轻松安排', transit: 'FCO → Monti 区酒店',
    items: [
      p('罗马菲乌米奇诺机场 FCO', 'FCO 机场', 'transport', [41.8003, 12.2389], '18:00', { note: '落地后过海关、取行李约 1 小时' }),
      p('DoubleTree by Hilton Rome Monti', '罗马酒店', 'hotel', [41.8978, 12.4988], '20:00', { note: '入住 3 晚 · 已确认' }),
      p('Monti 街区', 'Monti 晚餐', 'food', [41.8957, 12.4962], '20:30', { note: '酒店附近找营业的小馆简餐' })
    ]
  },
  {
    number: 2, date: '2026-12-28', label: '12/28 · 周一', cityId: 'rome', icon: '⛪', title: '梵蒂冈 + 纳沃纳 + 万神殿',
    weather: '步行较多 · 早点出门', transit: '全天包车 · 10 小时 / 100 公里',
    items: [
      p('圣彼得大教堂', '圣彼得大教堂', 'sight', [41.9022, 12.4539], '08:00', { note: '《圣殇》、圣彼得广场圣诞树和马槽' }),
      p('梵蒂冈博物馆', '梵蒂冈博物馆', 'sight', [41.9065, 12.4536], '11:30', { note: '含西斯廷礼拜堂，预计到 15:00', ticket: { status: 'confirmed', price: '€25', label: '门票已订' } }),
      p('Ristorante Calliope', 'Calliope 午餐', 'food', [41.9004, 12.4783], '15:10', { note: '许愿池、万神殿旁的龙虾馆' }),
      p('圣天使堡与圣天使桥', '圣天使堡', 'sight', [41.9031, 12.4663], '16:00', { note: '周一闭馆，只看外观' }),
      p('纳沃纳广场', '纳沃纳广场', 'sight', [41.8992, 12.4731], '16:45', { note: '节日市集' }),
      p('圣路易吉堂', '圣路易吉堂', 'sight', [41.8996, 12.4746], '17:15', { note: '免费看卡拉瓦乔三联画' }),
      p('万神殿', '万神殿', 'sight', [41.8986, 12.4769], '18:00', { note: '视开放及体力', ticket: { status: 'needed', price: '€7', label: '待购票' } }),
      p('Armando al Pantheon', 'Armando 晚餐', 'food', [41.899, 12.4768], '20:00', { note: '家庭 trattoria · 待订', status: 'todo' })
    ]
  },
  {
    number: 3, date: '2026-12-29', label: '12/29 · 周二', cityId: 'rome', icon: '⚔️', title: '古罗马 + 特雷维 + Borghese',
    weather: '博物馆日 · 17:00 准时入场', transit: '全天包车 · 10 小时 / 100 公里',
    items: [
      p('古罗马斗兽场', '斗兽场', 'sight', [41.8902, 12.4922], '08:00', { note: '与古罗马广场、帕拉丁山联票', ticket: { status: 'needed', price: '€18', label: '待购票' } }),
      p('古罗马广场与帕拉丁山', '古罗马广场', 'sight', [41.8925, 12.4853], '11:30', { note: '预计游览 2 小时' }),
      p('Monti 区午餐', 'Monti 午餐', 'food', [41.8945, 12.495], '13:30', { note: '斗兽场旁边小馆' }),
      p('威尼斯广场', '威尼斯广场', 'sight', [41.8958, 12.4822], '14:30', { note: '可选登顶看全城' }),
      p('特雷维喷泉', '特雷维喷泉', 'sight', [41.9009, 12.4833], '15:00', { note: '进入池边 €2，仅刷卡' }),
      p('西班牙台阶', '西班牙台阶', 'sight', [41.9059, 12.4823], '16:00'),
      p('博尔盖塞美术馆', '博尔盖塞美术馆', 'sight', [41.9142, 12.4923], '17:00', { note: '贝尔尼尼与卡拉瓦乔，限时 2 小时', ticket: { status: 'needed', price: '€18', label: '待购票' } }),
      p('Da Enzo al 29', 'Da Enzo 晚餐', 'food', [41.8892, 12.4708], '20:00', { note: 'carbonara 与炸朝鲜蓟 · 待订', status: 'todo' })
    ]
  },
  {
    number: 4, date: '2026-12-30', label: '12/30 · 周三', cityId: 'florence', icon: '🏰', title: '罗马 → 皮恩扎 → 锡耶纳 → 佛罗伦萨',
    weather: '转场日 · 行李随车', transit: '全天包车',
    items: [
      p('皮恩扎 Pienza', '皮恩扎', 'sight', [43.076, 11.679], '10:30', { note: '托斯卡纳山城短停' }),
      p('田野广场 Piazza del Campo', '田野广场', 'sight', [43.3186, 11.3308], '13:00', { note: '扇形贝壳广场' }),
      p('田野广场午餐', '锡耶纳午餐', 'food', [43.3185, 11.3311], '13:30', { note: '试 pici 粗面、野猪肉酱' }),
      p('锡耶纳大教堂', '锡耶纳大教堂', 'sight', [43.3177, 11.3289], '15:00', { note: '黑白条纹大理石与地板镶嵌画', ticket: { status: 'needed', price: '€7', label: '待购票' } }),
      p('Anglo American Hotel Florence', '佛罗伦萨酒店', 'hotel', [43.7781, 11.2388], '18:30', { note: '入住 3 晚 · 已确认' })
    ]
  },
  {
    number: 5, date: '2026-12-31', label: '12/31 · 周四', cityId: 'florence', icon: '🎨', title: '乌菲兹 + 圣十字 + 跨年夜',
    weather: '跨年夜 · 晚餐需提前订', transit: '步行 + 包车',
    items: [
      p('乌菲兹美术馆', '乌菲兹', 'sight', [43.7678, 11.2553], '08:15', { note: '波提切利《维纳斯的诞生》《春》', ticket: { status: 'needed', price: '€29', label: '待购票' } }),
      p("All'Antico Vinaio", '三明治午餐', 'food', [43.7686, 11.2585], '12:00', { note: '佛罗伦萨名气最大的夹肉三明治' }),
      p('圣十字大教堂', '圣十字大教堂', 'sight', [43.7685, 11.2626], '14:00', { note: '米开朗基罗、伽利略之墓' }),
      p('领主广场', '领主广场', 'sight', [43.7697, 11.2556], '17:30', { note: '跨年灯光投影与倒计时区域' }),
      p('米开朗基罗广场', '跨年观景', 'sight', [43.7629, 11.265], '22:30', { note: '俯瞰阿诺河烟花' })
    ]
  },
  {
    number: 6, date: '2027-01-01', label: '1/1 · 周五', cityId: 'florence', icon: '🌉', title: '佛罗伦萨户外散步',
    weather: '元旦 · 室内场馆大多关闭', transit: '慢走的一天',
    items: [
      p('圣母百花大教堂', '百花大教堂', 'sight', [43.7731, 11.256], '11:00', { note: '外观与洗礼堂铜门' }),
      p('领主广场与佣兵凉廊', '领主广场', 'sight', [43.7697, 11.2556], '12:00', { note: '露天雕塑，免费' }),
      p('老桥 Ponte Vecchio', '老桥', 'sight', [43.768, 11.2531], '14:00'),
      p('Oltrarno 街区', 'Oltrarno', 'shopping', [43.7663, 11.2477], '15:00', { note: '逛小巷与手工店' }),
      p('米开朗基罗广场', '日落观景', 'sight', [43.7629, 11.265], '16:30', { note: '看日落与城市全景' }),
      p('Trattoria Sostanza', 'Sostanza 晚餐', 'food', [43.7741, 11.247], '19:00', { note: '百年老店，牛排与黄油鸡' })
    ]
  },
  {
    number: 7, date: '2027-01-02', label: '1/2 · 周六', cityId: 'barcelona', icon: '✈️', title: '佛罗伦萨 → 巴塞罗那',
    weather: '转场日 · 海边日落', transit: 'VY6071 · 11:35 抵达 BCN T1',
    items: [
      p('巴塞罗那机场 T1', 'BCN 机场', 'transport', [41.2974, 2.0833], '11:35', { note: 'VY6071 抵达' }),
      p('Via Sants Hotel Barcelona', '巴塞罗那酒店', 'hotel', [41.3788, 2.1412], '13:00', { note: '入住 3 晚 · 已确认' }),
      p('哥特区', '哥特区', 'sight', [41.3839, 2.1763], '15:30', { note: '与 El Born 小巷散步' }),
      p('El Xampanyet', 'El Xampanyet', 'food', [41.3854, 2.1827], '17:30', { note: '老牌 cava + tapas，不订位' }),
      p('巴塞罗内塔海滩', '海边日落', 'sight', [41.3791, 2.189], '18:30')
    ]
  },
  {
    number: 8, date: '2027-01-03', label: '1/3 · 周日', cityId: 'barcelona', icon: '⛪', title: '巴特罗之家 + 圣家堂',
    weather: '建筑日 · 按预约时段入场', transit: '全天包车',
    items: [
      p('巴特罗之家 Casa Batlló', '巴特罗之家', 'sight', [41.3917, 2.1649], '08:30', { note: 'Blue 票 · 10:30 离开', ticket: { status: 'confirmed', price: '€35+', label: '门票已订' } }),
      p('圣家堂 Sagrada Família', '圣家堂', 'sight', [41.4036, 2.1744], '11:30', { note: '普通门票不登塔，App 中文讲解', ticket: { status: 'confirmed', price: '€26', label: '门票已订' } }),
      p('Cervecería Catalana', 'Catalana 午餐', 'food', [41.392, 2.1601], '13:00', { note: '人气 tapas · 可能排队' }),
      p('圣保罗医院建筑群', '圣保罗医院', 'sight', [41.4118, 2.1744], '16:30', { note: '周日可能提前关门' }),
      p('格拉西亚大道', '格拉西亚大道', 'shopping', [41.3938, 2.1644], '18:00')
    ]
  },
  {
    number: 9, date: '2027-01-04', label: '1/4 · 周一', cityId: 'barcelona', icon: '🦎', title: '奎尔公园 + 米拉之家',
    weather: '山坡较多 · 穿好走的鞋', transit: '全天包车',
    items: [
      p('奎尔公园 Park Güell', '奎尔公园', 'sight', [41.4145, 2.1527], '09:30', { note: '纪念区时段票', ticket: { status: 'needed', price: '€18', label: '待购票' } }),
      p('Gràcia 街区午餐', 'Gràcia 午餐', 'food', [41.4027, 2.1574], '12:30', { note: '奎尔公园下山顺路' }),
      p('米拉之家 Casa Milà', '米拉之家', 'sight', [41.3954, 2.1619], '14:00', { note: '屋顶烟囱雕塑，含中文导览', ticket: { status: 'needed', price: '€29+', label: '待购票' } }),
      p('巴塞罗那主教堂', '主教堂', 'sight', [41.3839, 2.1762], '16:00'),
      p('La Boqueria 市场', '波盖利亚市场', 'food', [41.3817, 2.1719], '17:00')
    ]
  },
  {
    number: 10, date: '2027-01-05', label: '1/5 · 周二', cityId: 'paris', icon: '✈️', title: '巴塞罗那 → 巴黎',
    weather: '转场日 · 夜看铁塔', transit: 'VY8010 · 12:05 抵达 ORY',
    items: [
      p('巴黎奥利机场 ORY', '奥利机场', 'transport', [48.7262, 2.3652], '12:05', { note: 'VY8010 抵达' }),
      p('Niepce Paris Hotel', '巴黎酒店', 'hotel', [48.8337, 2.3157], '14:00', { note: '入住 4 晚 · 已确认' }),
      p('巴黎圣母院', '巴黎圣母院', 'sight', [48.853, 2.3499], '16:00', { note: '免费 · 可选' }),
      p('圣礼拜堂', '圣礼拜堂', 'sight', [48.8554, 2.345], '17:00', { note: '可选', ticket: { status: 'needed', price: '€22', label: '待购票' } }),
      p('特罗卡德罗广场', '铁塔亮灯', 'sight', [48.8628, 2.287], '20:00', { note: '天黑后整点闪灯 5 分钟' })
    ]
  },
  {
    number: 11, date: '2027-01-06', label: '1/6 · 周三', cityId: 'paris', icon: '🖼️', title: '卢浮宫 + 铁塔 + 塞纳河',
    weather: '核心日 · 预约时间密集', transit: '全天包车',
    items: [
      p('卢浮宫', '卢浮宫', 'sight', [48.8606, 2.3376], '10:00', { note: '蒙娜丽莎、胜利女神、断臂维纳斯', ticket: { status: 'confirmed', price: '€32 + €6', label: '门票已订' } }),
      p('Café Marly', 'Café Marly', 'food', [48.861, 2.3365], '12:30', { note: '正对玻璃金字塔的拱廊咖啡馆' }),
      p('杜乐丽花园', '杜乐丽花园', 'sight', [48.8635, 2.327], '14:00'),
      p('橘园美术馆', '橘园美术馆', 'sight', [48.8638, 2.3226], '14:30', { note: '莫奈《睡莲》' }),
      p('埃菲尔铁塔', '埃菲尔铁塔', 'sight', [48.8584, 2.2945], '16:00', { note: '傍晚上塔看日落', ticket: { status: 'needed', price: '待定', label: '待购票' } }),
      p('Madame Brasserie', '铁塔晚餐', 'food', [48.8583, 2.2945], '18:30', { note: '铁塔一层 · 待订', status: 'todo' }),
      p('Bateaux-Mouches 塞纳河游船', '塞纳河游船', 'sight', [48.864, 2.301], '20:30', { note: '夜景游船', ticket: { status: 'needed', price: '€17', label: '待购票' } })
    ]
  },
  {
    number: 12, date: '2027-01-07', label: '1/7 · 周四', cityId: 'paris', icon: '👑', title: '凡尔赛 + 凯旋门',
    weather: '城外一日 · 早出发', transit: 'RER C / 全天包车',
    items: [
      p('凡尔赛宫', '凡尔赛宫', 'sight', [48.8049, 2.1204], '09:00', { note: '镜厅、国王与王后套房、花园', ticket: { status: 'confirmed', price: '€25', label: '门票已订' } }),
      p('ore – Ducasse au château de Versailles', '凡尔赛午餐', 'food', [48.8047, 2.1208], '12:30', { note: 'Pavillon Dufour 二楼' }),
      p('大特里亚农宫', '大特里亚农', 'sight', [48.815, 2.1049], '14:00'),
      p('凯旋门', '凯旋门', 'sight', [48.8738, 2.295], '16:30', { note: '登顶看日落' }),
      p('香榭丽舍大街', '香榭丽舍', 'shopping', [48.8698, 2.3077], '18:00'),
      p('Chez Janou', 'Chez Janou', 'food', [48.8566, 2.3688], '20:00', { note: '玛黑区普罗旺斯小馆 · 待订', status: 'todo' })
    ]
  },
  {
    number: 13, date: '2027-01-08', label: '1/8 · 周五', cityId: 'paris', icon: '🛍️', title: '蒙马特 + 歌剧院 + 老佛爷',
    weather: '城市漫步 · 最后一晚', transit: '全天包车',
    items: [
      p('蒙马特高地', '蒙马特', 'sight', [48.8867, 2.343], '09:30', { note: '小丘广场、爱墙' }),
      p('圣心大教堂', '圣心大教堂', 'sight', [48.8867, 2.3431], '10:30'),
      p('蒙马特午餐', '蒙马特午餐', 'food', [48.8847, 2.3387], '12:30'),
      p('加尼叶歌剧院', '巴黎歌剧院', 'sight', [48.872, 2.3316], '14:00', { note: '参观华丽内部', ticket: { status: 'needed', price: '€25', label: '待购票' } }),
      p('老佛爷百货', '老佛爷百货', 'shopping', [48.8738, 2.332], '15:30', { note: '穹顶与屋顶露台' }),
      p('Café de la Paix', '最后一晚晚餐', 'food', [48.8709, 2.331], '19:30', { note: '歌剧院旁老牌咖啡馆' })
    ]
  },
  {
    number: 14, date: '2027-01-09', label: '1/9 · 周六', cityId: 'paris', icon: '✈️', title: '离开巴黎',
    weather: '返程日 · 航班待订', transit: '酒店 → CDG',
    items: [
      p('Niepce Paris Hotel', '巴黎酒店', 'hotel', [48.8337, 2.3157], '08:30', { note: '收拾行李、办理退房' }),
      p('巴黎戴高乐机场 CDG', 'CDG 机场', 'transport', [49.0097, 2.5479], '待定', { note: '飞往 SFO · 航班待订', status: 'todo' })
    ]
  }
];

export const expenseSeed = [
  { id: 1, category: '住宿', title: '罗马酒店', amount: 600, currency: 'USD', payer: 'Claire', split: '均分', date: '2026-12-27' },
  { id: 2, category: '住宿', title: '佛罗伦萨酒店', amount: 900, currency: 'EUR', payer: 'Chase', split: '均分', date: '2026-12-30' },
  { id: 3, category: '住宿', title: '巴塞罗那酒店', amount: 300, currency: 'EUR', payer: 'Claire', split: '均分', date: '2027-01-02' },
  { id: 4, category: '门票', title: '卢浮宫', amount: 76, currency: 'EUR', payer: 'Claire', split: '均分', date: '2027-01-06' },
  { id: 5, category: '门票', title: '凡尔赛宫', amount: 50, currency: 'EUR', payer: 'Chase', split: '均分', date: '2027-01-07' }
];

export const categories = [
  { id: 'all', label: '全部', icon: '✦' },
  { id: 'sight', label: '景点', icon: '📍' },
  { id: 'food', label: '吃喝', icon: '🍴' },
  { id: 'shopping', label: '购物', icon: '🛍' },
  { id: 'hotel', label: '酒店', icon: '🛏' },
  { id: 'transport', label: '交通', icon: '✈' }
];

export const typeLabels = Object.fromEntries(categories.map((item) => [item.id, item.label]));
