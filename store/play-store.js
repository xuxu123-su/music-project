import { getSongDetail, getSongLyric } from "../service/player"
import { HYEventStore } from 'hy-event-store'
import {parseLyric} from "../utils/parse-lyric"

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,

    id: 0,
    // 歌曲数据
    currentSong: {},
    // 歌曲总时长
    durationTime: 0,
    // 歌词数据
    lyricInfo: [],

    // 歌词索引
    firstIndex: 0,
    lastIndex: 0,
    // 显示两行歌词
    firstLyricText: '',
    lastLyricText: '',
    // 歌曲播放时长
    currentTime: 0,

    // 播放模式 0:顺序播放  1:单曲循环  2:随机播放
    playIndex: 0,
    // 歌曲列表
    playSongList: [],
    // 歌曲索引
    playSongIndex: 0,

    // 播放状态
    isPlaying: false,
    isStoping: false
  },
  actions: {
    playMusicAction(ctx, {id, isRefresh = false}) {
      if (ctx.id == id && !isRefresh) {
        this.dispatch('musicPlayStatusAction', true)
        return
      }
      ctx.id = id

      // 修改播放状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfo = []
      ctx.currentTime = 0
      ctx.firstIndex = 0
      ctx.lastIndex = 0
      ctx.firstLyricText = ''
      ctx.lastLyricText = ''

      // 请求歌曲详情
      getSongDetail(id).then(res => {
        // console.log(res.data);
        ctx.currentSong = res.data.songs[0]
        ctx.durationTime = res.data.songs[0].dt
        audioContext.title = res.data.songs[0].name
      })
  
      // 请求歌词
      getSongLyric(id).then(res => {
          const lyricString = res.data.lrc.lyric
          const lyric = parseLyric(lyricString)
          ctx.lyricInfo = lyric
      })

      // 使用audioContext播放歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true

      // 监听audioContext
      if (ctx.isFirstPlay) {
        playerStore.dispatch('setupAudioContextAction') 
        ctx.isFirstPlay = false
      }
    },

    setupAudioContextAction(ctx) {
      // 监听歌曲可以播放
      audioContext.onCanplay(() => {
          audioContext.play()
      })

      // 监听时间改变
      audioContext.onTimeUpdate(() => {
        // 获取当前时间
        const currentTime = audioContext.currentTime * 1000
        
        // 根据当前时间修改currentTime / sliderValue
        ctx.currentTime = currentTime

        if (!ctx.lyricInfo.length) return
        // 根据当前时间去查找播放歌词
        for (let i = 0; i < ctx.lyricInfo.length; i++) {
            const info = ctx.lyricInfo[i]
            if (currentTime < info.time) {
                const currentId = i - 2
                if (ctx.firstIndex !== currentId) {
                    const currentLyrics = ctx.lyricInfo[currentId]
                    ctx.firstLyricText = currentLyrics.text
                    ctx.firstIndex = currentId
                }

                const currentIndex = i - 1
                if (ctx.lastIndex !== currentIndex) {
                    const currentLyric = ctx.lyricInfo[currentIndex]
                    ctx.lastLyricText = currentLyric.text
                    ctx.lastIndex = currentIndex
                }
                break;
            }
        }
      })

      // 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch('newMusicAction')
      })

      // 监听音乐播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })

      // 监听音乐暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })

      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },

    // 歌曲播放状态
    musicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = currentSong.name
        audioContext.seek(ctx.currentTime)
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },

    // 切换歌曲
    newMusicAction(ctx, isNext = true) {
      // 获取当前音乐索引
      let index = ctx.playSongIndex
      // 根据不同的播放模式获取下一首歌的索引
      switch(ctx.playIndex) {
        // 顺序播放
        case 0:
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playSongList.length - 1
          if (index === ctx.playSongList.length) index = 0
          break
        // 单曲循环
        case 1:
          break
        // 随机播放
        case 2:
          index = Math.floor(Math.random() * ctx.playSongList.length)
          break
      }

      // 获取歌曲
      let currentSong = ctx.playSongList[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        ctx.playSongIndex = index
      }
      // console.log(ctx.playSongList);
      // 播放新的歌曲
      this.dispatch('playMusicAction', {id: currentSong.id, isRefresh: true})
    }
  }
})

export {
  audioContext,
  playerStore
}