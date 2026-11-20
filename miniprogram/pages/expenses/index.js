const { trip } = require('../../data/trip')

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

Page({
  data: {
    tripName: trip.name,
    currency: '€',
    expenses: clone(trip.expenses),
    budget: trip.budget,
    budgetPercent: Math.round((trip.expenses.total / trip.budget) * 100),
    showEntrySheet: false,
    categoryNames: ['吃喝', '交通', '住宿', '门票', '购物', '其他'],
    categoryIndex: 0,
    draft: {
      title: '',
      amount: '',
      payer: 'Claire'
    }
  },

  onShow() {
    if (this.getTabBar && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  openEntrySheet() {
    this.setData({ showEntrySheet: true })
  },

  closeEntrySheet() {
    this.setData({ showEntrySheet: false })
  },

  stopPropagation() {},

  handleInput(event) {
    const field = event.currentTarget.dataset.field
    this.setData({ [`draft.${field}`]: event.detail.value })
  },

  handleCategoryChange(event) {
    this.setData({ categoryIndex: Number(event.detail.value) })
  },

  saveExpense() {
    const amount = Number(this.data.draft.amount)
    const title = this.data.draft.title.trim()

    if (!title || !amount || amount <= 0) {
      wx.showToast({ title: '请填写名称和金额', icon: 'none' })
      return
    }

    const expenses = clone(this.data.expenses)
    const category = this.data.categoryNames[this.data.categoryIndex]
    expenses.total = Number((expenses.total + amount).toFixed(2))
    expenses.recent.unshift({
      id: `local-${Date.now()}`,
      icon: category === '吃喝' ? '☕' : category === '交通' ? '🚇' : '◌',
      title,
      detail: `${category} · ${this.data.draft.payer} 支付`,
      amount,
      date: '今天'
    })

    this.setData({
      expenses,
      budgetPercent: Math.round((expenses.total / this.data.budget) * 100),
      showEntrySheet: false,
      categoryIndex: 0,
      draft: { title: '', amount: '', payer: 'Claire' }
    })
    wx.showToast({ title: '已记一笔', icon: 'success' })
  }
})

