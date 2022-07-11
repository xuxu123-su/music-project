import { getSearch, getSearchSuggest, getSearchResult } from "../../service/search"
import debounce from "../../utils/debounce"
import { stringToNodes } from "../../utils/nodes"

const debounceSuggest = debounce(getSearchSuggest, 100)

Page({
    data: {
        hotKey: [],
        suggest: [],
        songSuggest: [],
        result: [],
        // 搜索值
        value: ""
    },

    onLoad(options) {
        this.getSearchData()
    },

    getSearchData() {
        getSearch().then(res => {
            this.setData({ hotKey: res.data.result.hots })
        })
    },

    // 搜索框
    searchChange(event) {
        // 获取输入关键字
        const value = event.detail
        // 保存关键字
        this.setData({ value })
        // 判断关键字为空的逻辑
        if(!value.length) {
            this.setData({ suggest: [] })
            this.setData({ result: [] })
            // 输入快速删除取消发送网络请求
            debounceSuggest.cancel()
            return
        }
        // 发送网络请求
        debounceSuggest(value).then(res => {
            // 输入快速删除逻辑判断
            // if(!this.data.value.length) return
            // 获取建议关键字
            const suggest = res.data.result.allMatch
            this.setData({ suggest })
            if(!suggest) return
            // 转成nodes节点
            const suggestKey = suggest.map(item => item.keyword)
            const songSuggest = []
            for(const keyword of suggestKey) {
                const nodes = stringToNodes(keyword, value)
                songSuggest.push(nodes)
            }
            this.setData({ songSuggest })
        })
    },

    // 监听事件
    searchClick() {
        const value = this.data.value
        getSearchResult(value).then(res => {
            this.setData({ result: res.data.result.songs })
        })
    },

    // 点击建议搜索
    itemClick(event) {
        // 获取点击关键字
        const keyword = event.currentTarget.dataset.item
        // 将关键字设置到value中
        this.setData({ value: keyword })
        // 发送网络请求
        this.searchClick()
    },

    // 热门搜索
    // tagClick(event) {
    //     const keyword = event.currentTarget.dataset.item
    //     // 将关键字设置到value中
    //     this.setData({ value: keyword })
    //     // 发送网络请求
    //     this.searchClick()
    // }
})