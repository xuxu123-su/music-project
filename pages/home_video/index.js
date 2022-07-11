import { getTopMv } from "../../service/video"
Page({
  data: {
    topMv: [],
    more: true
  },
  onLoad(options) {
    this.getMvData(0)
  },
  //  封装网络请求方法
  getMvData: async function(offset) {
    // 判断发送网络请求
    if(!this.data.more) return
    // 展示加载动画
    wx.showNavigationBarLoading()
    // 请求数据
    const res = await getTopMv(offset)
    let newData = this.data.topMv
    if(offset === 0) {
      newData = res.data.data
    }else {
      newData = newData.concat(res.data.data)
    }
    // 设置数据
    this.setData({ topMv: newData })
    this.setData({ more: res.data.hasMore })

    wx.hideNavigationBarLoading()
    if(offset === 0) {
      wx.stopPullDownRefresh()
    }
  },
  // 点击事件
  handleVideo(event) {
    const id = event.currentTarget.dataset.item.id
    console.log(id);
    wx.navigateTo({
      url: '/pages/play_video/index?id=' + id,
      // url: `/pages/play_video/index?id=${id}`
    })
  },
  //  下拉刷新
  onPullDownRefresh() {
    this.getMvData(0)
  },
  //  上拉加载
  onReachBottom() {
    this.getMvData(this.data.topMv.length)
  }
})