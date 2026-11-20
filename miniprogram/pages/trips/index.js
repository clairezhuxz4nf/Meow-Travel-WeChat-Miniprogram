const { trip } = require('../../data/trip')

Page({
  data: {
    trip,
    budgetPercent: Math.round((trip.spent / trip.budget) * 100)
  },

  onShow() {
    if (this.getTabBar && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  openCity(event) {
    wx.navigateTo({ url: `/pages/city/index?id=${event.currentTarget.dataset.id}` })
  },

  openTickets() {
    wx.navigateTo({ url: '/pages/tickets/index' })
  },

  openExpenses() {
    wx.switchTab({ url: '/pages/expenses/index' })
  }
})

