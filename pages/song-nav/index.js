import { getMenu } from "../../service/music"
Page({
    data: {
        songList: [],
    },

    onLoad(options) {
        
        const cat = options.cat
        if(cat == "hot") {
            this.getSongList("全部", 15, 0)
        }else {
            this.getSongList("华语", 15, 0)
        }
    },

    // 封装请求
    async getSongList (cat, limit, offset) {
        const res = await getMenu(cat, limit, offset)
        let newData = this.data.songList
        if(offset === 0) {
            newData = res.data.playlists
        }else {
            newData = newData.concat(res.data.playlists)
        }
        // 设置数据
        this.setData({ songList: newData })
        // 加载
        wx.hideNavigationBarLoading()
        if(offset === 0) {
            wx.stopPullDownRefresh()
        }
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.getSongList("全部", 15, 0)
    },

    // 上拉加载
    onReachBottom() {
        this.getSongList("全部", 15, this.data.songList.length)
    },

    onUnload() {

    },
})