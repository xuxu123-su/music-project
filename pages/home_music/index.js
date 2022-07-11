import { rankingStore, rankingName, playerStore } from '../../store/index'
import { getBanner, getMenu } from '../../service/music'
import queryRect from '../../utils/query-rect'

Page({
    data: {
        swiperHeight: 0,
        // 轮播图
        banners: [],
        // 推荐歌曲
        recomend: [],
        // 热门歌单
        hotSong: [],
        // 推荐歌单
        recomendSong: [],
        // 巅峰榜数据
        rankings: { 3779629: {}, 2884035: {}, 19723756: {} },

        currentSong: {},
        isPlaying: false,
        playState: 'paused'
    },

    onLoad(options) {
        this.getPageData()
        // 发起共享数据请求
        rankingStore.dispatch("getRankingDataAction")
        // 从store获取共享数据
        this.setupPlayerStore()
    },

    // 网络请求
    getPageData() {
        // 轮播图
        getBanner().then(res => {
            this.setData({ banners: res.data.banners })
        })
        // 热门歌单
        getMenu().then(res => {
            this.setData({ hotSong: res.data.playlists })
        })
        // 推荐歌单
        getMenu("华语").then(res => {
            this.setData({ recomendSong: res.data.playlists })
        })
    },

    // 搜索框事件
    searchChange() {
        wx.navigateTo({
          url: '/pages/search/index',
        })
    },

    imageLoad() {
        queryRect('.swiper-image').then(res => {
            const rect = res[0]
            this.setData({ swiperHeight: rect.height })
        })
    },

    // 推荐歌曲更多
    moreClick() {
        this.getNavigateTo("hotRanking")
    },

    // 热门歌单更多
    hotClick() {
        this.getSongNav("hot")
    },

    // 推荐歌单更多
    recomClick() {
        this.getSongNav("华语")
    },

    // 歌单跳转
    getSongNav(cat) {
        wx.navigateTo({
          url: `/pages/song-nav/index?cat=${cat}`,
        })
    },

    // 巅峰榜单更多
    rankingClick(event) {
        const id = event.currentTarget.dataset.id
        const rankings = rankingName[id]
        this.getNavigateTo(rankings)
    },

    // 封装跳转歌曲歌单
    getNavigateTo(ranking) {
        wx.navigateTo({
            url: `/pages/detail-song/index?ranking=${ranking}&type=rank`,
        })
    },

    songItemClick(e) {
        const index = e.currentTarget.dataset.index
        playerStore.setState('playSongList', this.data.recomend)
        playerStore.setState('playSongIndex', index)
    },

    // 播放 暂停点击  catchtap可以阻止事件向上冒泡  stopPropagation()
    playbtnClick() {
        playerStore.dispatch('musicPlayStatusAction', !this.data.isPlaying)
    },

    // 点击跳转详情页
    playbarClick() {
        wx.navigateTo({
          url: '/pages/music-plary/index?id=' + this.data.currentSong.id,
        })
    },

    onUnload() {
        
    },

    getRanking(id) {
        return (res) => {
            if(Object.keys(res).length === 0) return
            const name = res.name
            const coverImgUrl = res.coverImgUrl
            const songList = res.tracks.slice(0, 3)
            const playCount = res.playCount
            const songObj = { name, coverImgUrl, songList, playCount }
            const originSong = { ...this.data.rankings, [id]: songObj }
            this.setData({
                rankings: originSong
            })
        }
    },

    setupPlayerStore() {
        // 热门榜数据
        rankingStore.onState("hotRanking", res => {
            if(!res.tracks) return
            const recomend = res.tracks.slice(0, 6)
            this.setData({ recomend })
        })
        // 巅峰榜数据
        rankingStore.onState("newSong", this.getRanking(JSON.stringify(3779629)))
        rankingStore.onState("originalSong", this.getRanking(JSON.stringify(2884035)))
        rankingStore.onState("soarSong", this.getRanking(JSON.stringify(19723756)))

        // 播放器监听
        playerStore.onStates(['currentSong', 'isPlaying'], ({currentSong, isPlaying}) => {
            if (currentSong) this.setData({ currentSong })
            if (isPlaying !== undefined) this.setData({ isPlaying, playState: isPlaying ? 'running' : 'paused' })
        })
    }
})