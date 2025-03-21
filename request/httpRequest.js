const baseConfig = {
  baseURL: '',
  timeout: 10000 // 默认超时时间
}
// 核心请求方法
export const request = (options = {}) => {
  // 合并配置
  const mergedOptions = {
    ...baseConfig,
    ...options,
    header: {
      'Content-Type': 'application/json',
      ...options.header
    }
  }

  // 创建 Promise
  return new Promise((resolve, reject) => {
    // 超时处理
    // const timer = setTimeout(() => {
    //   reject(new Error('请求超时'))
    //   abortController?.abort()
    // }, mergedOptions.timeout)

    // // 支持请求取消
    // const abortController = new AbortController()

    // 调用原生请求
    uni.request({
      ...mergedOptions,
      // signal: abortController.signal,
      success: (res) => {
        // clearTimeout(timer)
        resolve(res.data) // 通常只需要核心数据
      },
      fail: (err) => {
        // clearTimeout(timer)
        reject(err)
      }
    })
  })
}