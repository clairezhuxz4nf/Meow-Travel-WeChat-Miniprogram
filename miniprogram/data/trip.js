const trip = {
  id: 'spring-cities-2027',
  name: '春日六城',
  subtitle: '和朋友一起慢慢走',
  startDate: '2027-05-02',
  endDate: '2027-05-18',
  days: 17,
  companionCount: 3,
  currency: 'EUR',
  budget: 5200,
  spent: 3860,
  cities: [
    {
      id: 'paris',
      name: '巴黎',
      country: '法国',
      dates: '5月2日–5月4日',
      startDate: '2027-05-02',
      endDate: '2027-05-04',
      nights: 2,
      status: 'current',
      accent: '#D6A6A0',
      latitude: 48.8566,
      longitude: 2.3522,
      note: '博物馆、街区与塞纳河',
      places: [
        { id: 'louvre', markerId: 1, name: '卢浮宫', category: '景点', latitude: 48.8606, longitude: 2.3376, address: 'Rue de Rivoli, 75001 Paris', opening: '09:00–18:00', booking: '已购票' },
        { id: 'cafe', markerId: 2, name: '花神咖啡馆', category: '吃喝', latitude: 48.8541, longitude: 2.3325, address: '172 Bd Saint-Germain, Paris', opening: '07:30–01:30', booking: '已预订' },
        { id: 'cruise', markerId: 3, name: '塞纳河游船', category: '体验', latitude: 48.8583, longitude: 2.2945, address: 'Port de la Bourdonnais', opening: '10:00–22:30', booking: '已购票' },
        { id: 'hotel', markerId: 4, name: '巴黎花园酒店', category: '酒店', latitude: 48.8493, longitude: 2.3370, address: 'Latin Quarter, Paris', opening: '全天', booking: '已确认' }
      ]
    },
    { id: 'brussels', name: '布鲁塞尔', country: '比利时', dates: '5月5日–5月6日', startDate: '2027-05-05', endDate: '2027-05-06', nights: 1, status: 'upcoming', accent: '#C9A65B', latitude: 50.8503, longitude: 4.3517, note: '广场、漫画与巧克力', places: [] },
    { id: 'amsterdam', name: '阿姆斯特丹', country: '荷兰', dates: '5月7日–5月9日', startDate: '2027-05-07', endDate: '2027-05-09', nights: 2, status: 'upcoming', accent: '#A9BCC8', latitude: 52.3676, longitude: 4.9041, note: '运河、博物馆与骑行', places: [] },
    { id: 'berlin', name: '柏林', country: '德国', dates: '5月10日–5月12日', startDate: '2027-05-10', endDate: '2027-05-12', nights: 2, status: 'upcoming', accent: '#A8B39B', latitude: 52.52, longitude: 13.405, note: '建筑、历史与夜晚', places: [] },
    { id: 'prague', name: '布拉格', country: '捷克', dates: '5月13日–5月15日', startDate: '2027-05-13', endDate: '2027-05-15', nights: 2, status: 'upcoming', accent: '#D6A6A0', latitude: 50.0755, longitude: 14.4378, note: '老城、桥与天文钟', places: [] },
    { id: 'vienna', name: '维也纳', country: '奥地利', dates: '5月16日–5月18日', startDate: '2027-05-16', endDate: '2027-05-18', nights: 2, status: 'upcoming', accent: '#A9BCC8', latitude: 48.2082, longitude: 16.3738, note: '音乐、宫殿与咖啡', places: [] }
  ],
  transport: [
    { id: 't1', from: '巴黎', to: '布鲁塞尔', type: 'Eurostar', date: '5月5日', time: '08:19', status: '已确认' },
    { id: 't2', from: '布鲁塞尔', to: '阿姆斯特丹', type: '城际列车', date: '5月7日', time: '09:22', status: '已确认' }
  ],
  tickets: [
    { id: 'ticket-1', category: '交通', title: '欧洲之星 Eurostar', subtitle: '巴黎 → 布鲁塞尔', date: '5月5日 08:19', status: '已确认', tone: 'blue' },
    { id: 'ticket-2', category: '酒店', title: '巴黎花园酒店', subtitle: '3 晚 · 2 间房', date: '5月2日–5月5日', status: '已确认', tone: 'green' },
    { id: 'ticket-3', category: '门票', title: '卢浮宫门票', subtitle: '3 人 · 09:00 入场', date: '5月2日', status: '已购票', tone: 'yellow' },
    { id: 'ticket-4', category: '交通', title: '夜火车 Night Train', subtitle: '布拉格 → 维也纳', date: '5月15日 21:40', status: '已确认', tone: 'rose' }
  ],
  expenses: {
    total: 3860,
    categories: [
      { name: '住宿', value: 1350, percent: 35, color: '#8FA9B7' },
      { name: '交通', value: 965, percent: 25, color: '#A8B39B' },
      { name: '门票', value: 772, percent: 20, color: '#C9A65B' },
      { name: '吃喝', value: 579, percent: 15, color: '#D6A6A0' },
      { name: '其他', value: 194, percent: 5, color: '#CAC4BA' }
    ],
    members: [
      { name: 'Claire', initial: 'C', balance: 120, type: '应收' },
      { name: 'Mia', initial: 'M', balance: 60, type: '应付' },
      { name: 'Leo', initial: 'L', balance: 60, type: '应付' }
    ],
    recent: [
      { id: 'e1', icon: '🚇', title: '巴黎地铁', detail: '3 人 · Claire 支付', amount: 12.6, date: '5月2日' },
      { id: 'e2', icon: '☕', title: '花神咖啡馆午餐', detail: '3 人 · Mia 支付', amount: 48, date: '5月2日' },
      { id: 'e3', icon: '🏨', title: '巴黎花园酒店', detail: '3 晚 · Claire 支付', amount: 720, date: '5月1日' }
    ]
  }
}

const dailyPlans = {
  '2027-05-02': {
    cityId: 'paris',
    weather: { icon: '⛅', text: '多云', temperature: '18° / 11°' },
    summary: '4 个地点 · 2 项已预订',
    items: [
      { id: 'louvre', time: '09:00', endTime: '12:00', title: '卢浮宫', category: '景点', status: '已购票', transport: '步行 12 分钟 · 0.9 km', icon: '◇', accent: '#D6A6A0', isNext: true },
      { id: 'cafe', time: '12:30', endTime: '14:00', title: '花神咖啡馆', category: '吃喝', status: '已预订', transport: '地铁 15 分钟 · 3 站', icon: '☕', accent: '#C9A65B' },
      { id: 'cruise', time: '15:00', endTime: '17:00', title: '塞纳河游船', category: '体验', status: '已购票', transport: '步行 8 分钟 · 0.6 km', icon: '⌁', accent: '#A9BCC8' },
      { id: 'dinner', time: '19:00', endTime: '21:00', title: 'Le Relais 餐厅', category: '吃喝', status: '已预订', transport: '地铁 18 分钟 · 4 站', icon: '♨', accent: '#A8B39B' }
    ]
  },
  '2027-05-03': {
    cityId: 'paris',
    weather: { icon: '☀️', text: '晴', temperature: '20° / 12°' },
    summary: '3 个地点 · 1 项待确认',
    items: [
      { id: 'montmartre', time: '09:30', endTime: '11:30', title: '蒙马特高地', category: '街区', status: '自由活动', transport: '地铁 22 分钟', icon: '△', accent: '#A9BCC8', isNext: true },
      { id: 'lunch-2', time: '12:00', endTime: '13:30', title: '街角午餐', category: '吃喝', status: '待决定', transport: '步行 6 分钟', icon: '☕', accent: '#C9A65B' },
      { id: 'orsay', time: '14:30', endTime: '17:30', title: '奥赛博物馆', category: '景点', status: '已购票', transport: '地铁 20 分钟', icon: '◇', accent: '#D6A6A0' }
    ]
  }
}

function getCity(cityId) {
  return trip.cities.find((city) => city.id === cityId) || trip.cities[0]
}

function getPlace(placeId) {
  for (let index = 0; index < trip.cities.length; index += 1) {
    const city = trip.cities[index]
    const place = city.places.find((item) => item.id === placeId)
    if (place) return Object.assign({ cityName: city.name }, place)
  }
  return Object.assign({ cityName: '巴黎' }, trip.cities[0].places[0])
}

module.exports = {
  dailyPlans,
  getCity,
  getPlace,
  trip
}

