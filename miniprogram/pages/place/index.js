const { getPlace } = require('../../data/trip')

Page({
  data: {
    place: null,
    buildingWindows: [1, 2, 3, 4, 5],
    checklist: [
      { id: 'c1', text: '提前 15 分钟到达', done: true },
      { id: 'c2', text: '带好电子票与证件', done: true },
      { id: 'c3', text: '准备耳机', done: false },
      { id: 'c4', text: '在出口集合', done: false }
    ]
  },

  onLoad(options) {
    const place = getPlace(options.id || 'louvre')
    wx.setNavigationBarTitle({ title: place.name })
    this.setData({ place })
  },

  toggleCheck(event) {
    const id = event.currentTarget.dataset.id
    const checklist = this.data.checklist.map((item) => (
      item.id === id ? Object.assign({}, item, { done: !item.done }) : item
    ))
    this.setData({ checklist })
  },

  addToItinerary() {
    wx.showToast({ title: '已加入今日行程', icon: 'success' })
  },

  showTicket() {
    wx.navigateTo({ url: '/pages/tickets/index' })
  }
})

