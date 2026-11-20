const { trip } = require('../../data/trip')

Page({
  data: {
    categories: ['全部', '酒店', '交通', '门票'],
    activeCategory: '全部',
    tickets: trip.tickets,
    filteredTickets: trip.tickets
  },

  handleCategory(event) {
    const activeCategory = event.currentTarget.dataset.category
    const filteredTickets = activeCategory === '全部'
      ? this.data.tickets
      : this.data.tickets.filter((ticket) => ticket.category === activeCategory)
    this.setData({ activeCategory, filteredTickets })
  },

  openTicket(event) {
    const ticket = this.data.tickets.find((item) => item.id === event.currentTarget.dataset.id)
    wx.showModal({
      title: ticket.title,
      content: `${ticket.subtitle}\n${ticket.date}\n状态：${ticket.status}`,
      confirmText: '知道了',
      showCancel: false
    })
  }
})

