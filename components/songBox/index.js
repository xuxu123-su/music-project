Component({
    properties: {
        item: {
            type: Object,
            value: {}
        }
    },

    data: {

    },

    methods: {
        boxClick(event) {
            const item = event.currentTarget.dataset.item
            wx.navigateTo({
              url: `/pages/detail-song/index?id=${item.id}&type=menu`,
            })
        }
    }
})
