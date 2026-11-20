const { dailyPlans, getCity } = require('../../data/trip')

function createMarkers(places) {
  return places.map((place) => ({
    id: place.markerId,
    latitude: place.latitude,
    longitude: place.longitude,
    width: 30,
    height: 36,
    callout: {
      content: place.name,
      color: '#2E3130',
      bgColor: '#FFFCF7',
      borderRadius: 8,
      padding: 8,
      fontSize: 12,
      display: 'BYCLICK'
    }
  }))
}

Page({
  data: {
    city: null,
    categories: ['全部', '景点', '吃喝', '体验', '酒店'],
    activeCategory: '全部',
    filteredPlaces: [],
    markers: [],
    polyline: [],
    itinerary: []
  },

  onLoad(options) {
    const city = getCity(options.id || 'paris')
    wx.setNavigationBarTitle({ title: city.name })
    this.setData({ city, itinerary: city.id === 'paris' ? dailyPlans['2027-05-02'].items : [] })
    this.applyFilter('全部')
  },

  applyFilter(category) {
    const places = category === '全部'
      ? this.data.city.places
      : this.data.city.places.filter((place) => place.category === category)

    this.setData({
      activeCategory: category,
      filteredPlaces: places,
      markers: createMarkers(places),
      polyline: [{
        points: this.data.city.places.map((place) => ({ latitude: place.latitude, longitude: place.longitude })),
        color: '#D96A60B8',
        width: 3,
        dottedLine: true
      }]
    })
  },

  handleCategory(event) {
    this.applyFilter(event.currentTarget.dataset.category)
  },

  handleMarkerTap(event) {
    const place = this.data.city.places.find((item) => item.markerId === event.detail.markerId)
    if (place) wx.navigateTo({ url: `/pages/place/index?id=${place.id}` })
  },

  openPlace(event) {
    wx.navigateTo({ url: `/pages/place/index?id=${event.currentTarget.dataset.id}` })
  },

  handleItinerarySelect(event) {
    const id = event.detail.id
    if (this.data.city.places.some((place) => place.id === id)) {
      wx.navigateTo({ url: `/pages/place/index?id=${id}` })
    }
  }
})

