// 正则(regular)表达式(expression)：字符串匹配利器

// [00:22.29]
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
  const lyricStrings = lyricString.split("\n")

  const lyricInfo = []
  for (const lineString of lyricStrings) {
    const timeResult = timeRegExp.exec(lineString)
    // continue没有值则执行下次循环
    if (!timeResult) continue
    // 获取事件
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const secondTime = timeResult[3]
    const millsecond = secondTime.length === 2 ? secondTime * 10 : secondTime * 1
    const time = minute + second + millsecond

    // 获取歌词文本
    const text = lineString.replace(timeResult[0], "")
    lyricInfo.push({time, text})
  }
  return lyricInfo
}