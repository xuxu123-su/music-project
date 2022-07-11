import hyRequest from './index'

// 热门搜索
export function getSearch() {
  return hyRequest.get("/search/hot")
}

// 关键词
export function getSearchSuggest(keywords) {
  return hyRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

// 关键词搜索
export function getSearchResult(keywords) {
  return hyRequest.get("/search", {keywords})
}