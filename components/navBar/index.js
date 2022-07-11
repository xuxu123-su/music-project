const globalData = getApp().globalData
Component({
    options: {
        multipleSlots: true
    },

    properties: {
        title: {
            type: String,
            value: "歌曲"
        }
    },

    data: {
        barHeight: globalData.barHeight,
        navBarHeight: globalData.navBarHeight
    },

    methods: {
        backClick() {
            this.triggerEvent('click')
        }
    }
})
