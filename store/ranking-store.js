import { HYEventStore } from 'hy-event-store'
import { getRanking } from '../service/music'

const songName = {
  0: 'newSong',
  1: 'hotRanking',
  2: 'originalSong',
  3: 'soarSong',
}

const rankingName = {
  3779629: 'newSong',
  13778678: 'hotRanking',
  2884035: 'originalSong',
  19723756: 'soarSong',
}

const songArr = [3779629, 3778678, 2884035, 19723756]

const rankingStore = new HYEventStore({
  state: {
    newSong: {}, // 新歌榜
    hotRanking: {}, // 热门榜
    originalSong: {}, // 原创榜
    soarSong: {}, // 飙升榜
  },
  actions: {
    getRankingDataAction(ctx) {
      // 榜单接口
      for(let i = 0; i < 4; i++) {
        getRanking(songArr[i]).then(res => {
          const songSheet = songName[i]
          ctx[songSheet] = res.data.playlist
        })
      }
    }
  }
})

export {
  rankingStore,
  rankingName
}