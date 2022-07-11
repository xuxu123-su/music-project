import { getMvUrl, getMvDetail, getRelateVideo } from "../../service/video"
Page({
    data: {
        mvList: {},
        mvDetail: {},
        mvRelate: [],
    },
    onLoad(options) {
        // 获取传入id
        const id = options.id
        // 获取页面数据
        this.getPageData(id)
    },
    getPageData(id) {
        // 1.请求播放地址
        getMvUrl(id).then(res => {
            this.setData({ mvList: res.data.data })
        })
        // 2.请求视频信息
        getMvDetail(id).then(res => {
            this.setData({ mvDetail: res.data.data })
        })
        // 3.请求相关视频
        getRelateVideo(id).then(res => {
            this.setData({ mvRelate: res.data.data })
        })
    },
})