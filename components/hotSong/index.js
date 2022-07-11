Component({
    properties: {
        songMenu: {
            type: Array,
            value: []
        }
    },

    data: {
        
    },

    methods: {
        menuClick(event) {
            const item = event.currentTarget.dataset.item
            wx.navigateTo({
              url: `/pages/detail-song/index?id=${item.id}&type=menu`,
            })
        }
    }
})
