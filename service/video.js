import hyRequest from './index'

// 获取视频mv信息
export function getTopMv(offset, limit = 10) {
  return hyRequest.get("/top/mv", {
    offset,
    limit
  })
}

// 获取mv播放地址 传入mv id
export function getMvUrl(id) {
  return hyRequest.get("/mv/url", {
    id
  })
}

// 获取mv播放详细信息 传入mv的id
export function getMvDetail(mvid) {
  return hyRequest.get("/mv/detail", {
    mvid
  })
}

// 获取mv相关视频 传入视频的id
export function getRelateVideo(id) {
  return hyRequest.get("/related/allvideo", {
    id
  })
}