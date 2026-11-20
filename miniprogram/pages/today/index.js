const { dailyPlans, getCity, trip } = require('../../data/trip')
const { formatDateLabel } = require('../../utils/date')

function buildMapData(city) {
  const markers = city.places.map((place) => ({
    id: place.markerId,
    latitude: place.latitude,
    longitude: place.longitude,
    width: 28,
    height: 34,
    callout: {
      content: place.name,
      color: '#2E3130',
      fontSize: 12,
      borderRadius: 8,
      bgColor: '#FFFCF7',
      padding: 8,
      display: 'BYCLICK'
    }
  }))

  return {
    markers,
    polyline: [{
      points: city.places.slice(0, 3).map((place) => ({
        latitude: place.latitude,
        longitude: place.longitude
      })),
      color: '#D96A60CC',
      width: 3,
      dottedLine: true
    }]
  }
}

Page({
  data: {
    selectedDate: '2027-05-02',
    dateLabel: '',
    trip,
    plan: null,
    city: null,
    nextItem: null,
    markers: [],
    polyline: [],
    progressText: '旅程第 1 天',
    hasPlan: true
  },

  onLoad() {
    const selectedDate = getApp().globalData.selectedDate
    this.loadDate(selectedDate)
  },

  onShow() {
    if (this.getTabBar && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  loadDate(selectedDate) {
    const plan = dailyPlans[selectedDate]
    const fallbackCity = getCity('paris')
    const city = plan ? getCity(plan.cityId) : fallbackCity
    const mapData = buildMapData(city)

    getApp().globalData.selectedDate = selectedDate
    this.setData({
      selectedDate,
      dateLabel: formatDateLabel(selectedDate),
      plan: plan || { weather: { icon: '·', text: '暂无', temperature: '--' }, summary: '这一天还没有安排', items: [] },
      city,
      nextItem: plan && plan.items.length ? plan.items[0] : null,
      markers: mapData.markers,
      polyline: mapData.polyline,
      hasPlan: Boolean(plan && plan.items.length),
      progressText: selectedDate === trip.startDate ? '旅程第 1 天' : '旅程第 2 天'
    })
  },

  handleDateChange(event) {
    this.loadDate(event.detail.value)
  },

  handleItinerarySelect(event) {
    const placeId = event.detail.id
    const knownPlace = this.data.city.places.some((place) => place.id === placeId)
    if (knownPlace) {
      wx.navigateTo({ url: `/pages/place/index?id=${placeId}` })
    }
  },

  openNext() {
    if (this.data.nextItem) {
      const placeId = this.data.nextItem.id
      const knownPlace = this.data.city.places.some((place) => place.id === placeId)
      if (knownPlace) wx.navigateTo({ url: `/pages/place/index?id=${placeId}` })
    }
  },

  handleMarkerTap(event) {
    const place = this.data.city.places.find((item) => item.markerId === event.detail.markerId)
    if (place) wx.navigateTo({ url: `/pages/place/index?id=${place.id}` })
  },

  openCity() {
    wx.navigateTo({ url: `/pages/city/index?id=${this.data.city.id}` })
  },

  openTickets() {
    wx.navigateTo({ url: '/pages/tickets/index' })
  },

  openExpenses() {
    wx.switchTab({ url: '/pages/expenses/index' })
  }
})

