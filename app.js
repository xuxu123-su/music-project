// app.js
App({
  globalData: {
    userInfo: null,
    barHeight: 0,
    navBarHeight: 44,
    screenWidth: 0,
    screenHeight: 0,
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取设备信息
    const info = wx.getSystemInfoSync()
    this.globalData.barHeight = info.statusBarHeight
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
  },
})
