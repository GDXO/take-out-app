/**
 * 保存数据到 localStorage
 */
export const saveDataToLocalStorage = (id, key, value) => {
  const seller = {
    [id]: {
      [key]: value
    }
  }

  window.localStorage.setItem('__seller__', JSON.stringify(seller))
}

/**
 * 读取 localStorage 中的数据
 */
export const readDataFromLocalStorage = (id, key, defaultValue) => {
  const seller = JSON.parse(window.localStorage.getItem('__seller__') || 'null')

  if (seller && seller[id] && seller[id][key]) {
    return seller[id][key]
  }

  return defaultValue
}
