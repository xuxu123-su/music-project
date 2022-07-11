import hyRequest from './index'

// 轮播图
export function getBanner() {
  return hyRequest.get("/banner", {type: 2})
}

// 歌曲排行
export function getRanking(id) {
  return hyRequest.get("/playlist/detail", {id})
}

// 歌单信息
export function getMenu(cat = "全部", limit = 6, offset = 0) {
  return hyRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

// 歌单详情
export function getHotMenu(id) {
  return hyRequest.get("/playlist/detail", {id})
}

// 热门歌单分类
export function getSongHot() {
  return hyRequest.get("/playlist/hot")
}