// const BASE_URL = "http://123.207.32.32:9001"
const BASE_URL = "https://coderwhy-music.vercel.app"

class HYRequest {
    constructor(baseURL) {
        this.baseURL = baseURL
    }

    request(url, method, params, header = {}) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseURL + url,
                method: method,
                header: header,
                data: params,
                success: function(res) {
                    resolve(res)
                },
                fail: function(err) {
                    reject(err)
                }
              })
        })
    }
    get(url, params, header) {
        return this.request(url, "GET", params, header)
    }
    post(url, data, header) {
        return this.request(url, "POST", data, header)
    }
}
const hyRequest = new HYRequest(BASE_URL)

export default hyRequest