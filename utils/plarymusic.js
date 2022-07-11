export default function musicPlary(id) {
  wx.navigateTo({
    url: '/pages/music-plary/index?id=' + id,
  })
}