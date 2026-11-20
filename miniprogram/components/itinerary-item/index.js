Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    last: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    handleTap() {
      this.triggerEvent('select', { id: this.data.item.id })
    }
  }
})

