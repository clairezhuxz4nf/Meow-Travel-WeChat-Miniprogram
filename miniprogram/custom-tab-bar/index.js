Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/today/index', text: '今日', icon: '●' },
      { pagePath: '/pages/trips/index', text: '行程', icon: '⌁' },
      { pagePath: '/pages/expenses/index', text: '花费', icon: '¥' }
    ]
  },

  methods: {
    switchTab(event) {
      const data = event.currentTarget.dataset
      if (data.index === this.data.selected) return
      wx.switchTab({ url: data.path })
    }
  }
})

