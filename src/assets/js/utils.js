/* 将毫秒数转换为yyyy-mm-dd格式: hms  是否带时分秒 */
export function timeFormat (time, connector, hms) {
  if (time === undefined || time === null) {
    return '-'
  } else {
    let myDate

    if (time === '') {
      myDate = new Date()
    } else {
      myDate = new Date(time)
    }

    const timeYear = myDate.getFullYear()
    const timeHour = myDate.getHours()
    const timeMin = myDate.getMinutes()
    let timeMon = myDate.getMonth() + 1
    let timeDay = myDate.getDate()
    let timeSec = myDate.getSeconds()

    if (timeMon < 10) {
      timeMon = `0${timeMon}`
    }
    if (timeDay < 10) {
      timeDay = `0${timeDay}`
    }
    if (timeSec < 10) {
      timeSec = `0${timeSec}`
    }
    if (hms) {
      return `${timeYear}${connector}${timeMon}${connector}${timeDay} ${timeHour}:${timeMin}:${timeSec}`
    } else {
      return `${timeYear}${connector}${timeMon}${connector}${timeDay}`
    }
  }
}

// 转化yyyy/mm/dd为年月日
export function returnYMD (oldTime) {
  const newTime = timeFormat(oldTime, '/', false)
  if (newTime === '-') {
    return '-'
  } else {
    const newTimeStr = newTime.split('/')
    return `${newTimeStr[0]}年${newTimeStr[1]}月${newTimeStr[2]}日'`
  }
}

/**
 *  解析 URL 参数
 * @returns 参数对象
 */
export function getUrlParams () {
  const search = window.location.search
  const params = {}
  const reg = /[?&][^?&]+=[^?&]+/g

  if (search) {
    const searchArr = search.match(reg)

    searchArr.forEach(item => {
      const tempArr = item.substring(1).split('=')
      const key = decodeURIComponent(tempArr[0])
      const value = decodeURIComponent(tempArr[1])
      params[key] = value
    })
  }

  return params
}
