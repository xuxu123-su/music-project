import { rankingStore, playerStore } from "../../store/index"
import { getHotMenu } from '../../service/music'

Page({
    data: {
        type: "",
        ranking: "",
        songInfo: {},
        state: false,
        imgUrl: "https://clc-1253185145.cos.ap-guangzhou.myqcloud.com/clc/d718d283-257b-47e7-8418-c6e5012be87a.jpg",
        recomImg: "https://clc-1253185145.cos.ap-guangzhou.myqcloud.com/clc/7f154d49-476f-4644-b5aa-14fc85d59aae.jpg"
    },

    onLoad(options) {
        const type = options.type
        this.setData({ type })
        const ranking = options.ranking
        // 请求歌单
        if(type === "menu") {
            const id = options.id
            getHotMenu(id).then(res => {
                this.setData({ songInfo: res.data.playlist })
            })
        }else if(type === "rank") {
            // 请求推荐歌曲和巅峰榜
            this.setData({ ranking })
            // 请求数据
            rankingStore.onState(ranking, this.getNetwork)
        }
        // 区别推荐歌曲和巅峰榜
        if(ranking == 'hotRanking') {
            this.setData({ state: true })
        }
    },

    handleSongClick(e) {
        const index = e.currentTarget.dataset.index
        playerStore.setState('playSongList', this.data.songInfo.tracks)
        playerStore.setState('playSongIndex', index)
    },
    
    onUnload() {
        if(this.data.ranking) {
            rankingStore.offState(this.data.ranking, this.getNetwork)
        }
    },

    getNetwork(res) {
        this.setData({ songInfo: res })
    },
})