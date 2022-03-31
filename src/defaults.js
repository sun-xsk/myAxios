const defaults = {
  method: 'get', // 默认不传入 method 则给一个 GET 方法

  timeout: 0, // 默认不设置超时

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*' // 默认给一个 Accept header
    }
  }
}
// 'delete', 'get', 'head', 'options' 这四种类型请求时默认 headers 为空
const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

// 'post', 'put', 'patch' 这三种类型请求时设置一个默认的 Content-Type
const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
