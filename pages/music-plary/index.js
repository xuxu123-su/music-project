import { audioContext, playerStore } from "../../store/index"

const playNames = ['order', 'repeat', 'random']

Page({
    data: {
        id: 0,
        // 切换
        banner: ['推荐', '歌曲', '歌词'],

        // 歌曲数据
        currentSong: {},
        // 歌曲总时长
        durationTime: 0,
        // 歌词数据
        lyricInfo: [],

        // 导航栏页
        page: 1,
        // 轮播页
        currentIndex: 1,
        countHeight: 0,
        
        // 歌词索引
        firstIndex: 0,
        lastIndex: 0,
        // 显示两行歌词
        firstLyricText: '',
        lastLyricText: '',
        // 歌曲播放时长
        currentTime: 0,

        // 进度条
        sliderValue: 0,
        isSlider: false,
        // 歌词滚动
        lyricScrollTop: 0,

        // 播放模式
        playIndex: 0,
        playName: 'order',
        // 播放状态
        isPlaying: false,
        playingName: 'pause',
    },

    onLoad(options) {
        // 获取id
        const id = options.id
        this.setData({ id })

        // 获取歌曲信息
        this.getPlayStore()

        // 计算高度
        const globalData = getApp().globalData
        const screenHeight = globalData.screenHeight
        const barHeight = globalData.barHeight
        const navBarHeight = globalData.navBarHeight
        const countHeight = screenHeight - barHeight - navBarHeight
        this.setData({ countHeight })
    },

    // 切换
    swiperChange(e) {
        const current = e.detail.current
        this.setData({ currentIndex: current, page: current })
    },

    // 点击切换
    tabClick(e) {
        const index = e.currentTarget.dataset.index
        this.setData({ currentIndex: index, page: index })
    },

    // 点击返回
    navClick() {
        wx.navigateBack()
    },

    // 点击滑动条事件
    sliderChange(e) {
        // 获取slider变化的值
        const value = e.detail.value
        // 计算播放的currentTime，歌曲总时长乘value处于100
        const currentTime = this.data.durationTime * value / 100
        // 设置context播放currentTime位置的音乐
        audioContext.seek(currentTime / 1000)
        // 设置最新的sliderValue
        this.setData({ sliderValue: value, isSlider: false })
    },

    // 拖拽滑动条事件
    sliderChanging(e) {
        const value = e.detail.value
        const currentTime = this.data.durationTime * value / 100
        this.setData({ isSlider: true, currentTime })
    },

    // 更改播放模式
    handleBtnClick() {
        // 计算最新的playIndex
        let playIndex = this.data.playIndex + 1
        if (playIndex === 3) playIndex = 0
        console.log(playIndex);
        // 设置playerStore中的playIndex
        playerStore.setState('playIndex', playIndex)
    },

    // 开始/暂停 播放
    handlePlaying() {
        playerStore.dispatch('musicPlayStatusAction', !this.data.isPlaying)
    },

    // 上一首歌曲
    prevBtnClick() {
        playerStore.dispatch('newMusicAction', false)
    },

    // 下一首歌曲
    nextBtnClick() {
        playerStore.dispatch('newMusicAction', true)
    },

    // 数据监听
    getPlayStore() {
        // 监听音乐数据
        playerStore.onStates(['currentSong', 'durationTime', 'lyricInfo'], ({
            currentSong,
            durationTime,
            lyricInfo
        }) => {
            if (currentSong) this.setData({ currentSong })
            if (durationTime) this.setData({ durationTime })
            if (lyricInfo) this.setData({ lyricInfo })
        })

        // 监听时间变化数据
        playerStore.onStates(['currentTime', 'lastIndex', 'firstIndex', 'firstLyricText', 'lastLyricText'], ({
            currentTime,
            firstIndex,
            firstLyricText,
            lastIndex,
            lastLyricText
        }) => {
            // 时间变化
            if (currentTime && !this.data.isSlider) {
                const sliderValue = currentTime / this.data.durationTime * 100
                this.setData({ currentTime, sliderValue })
            }
            // 歌词变化
            if (firstIndex) {
                this.setData({ firstIndex })
            }
            if (firstLyricText) {
                this.setData({ firstLyricText })
            }
            if (lastIndex) {
                this.setData({ lastIndex, lyricScrollTop: lastIndex * 35 })
            }
            if (lastLyricText) {
                this.setData({ lastLyricText })
            }
        })

        // 监听播放模式变化
        playerStore.onStates(['playIndex', 'isPlaying'], ({playIndex, isPlaying}) => {
            if (playIndex !== undefined) {
                this.setData({ playIndex, playName: playNames[playIndex] })
            }

            if (isPlaying !== undefined) {
                this.setData({
                    isPlaying,
                    playingName: isPlaying ? 'pause' : 'resume'
                })
            }
        })
    },

    onUnload() {

    }
})