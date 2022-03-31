import dispatchRequest from "./dispatchRequest.js";
import InterceptorManager from "./InterceptorManager.js";
import mergeConfig from "./mergeConfig.js";

class Axios {
    defaults={}
    interceptors={}

    constructor(initConfig) {
        this.defaults = initConfig;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
    }

    request(url, config) {
        if (typeof url === "string") {
            if (!config) {
                config = {};
            }
            config.url = url;
        } else {
            config = url;
        }
        // 合并默认配置与用户传进来的配置
        config = mergeConfig(this.defaults, config)

        // 定义一个数组，数组中放入，会发送真实请求的对象，可以想象成它也是一个拦截器
        const chain = [
            {
                resolved: dispatchRequest,
                rejected: undefined
            }
        ];
        // 当用户使用 axios.interceptors.request.use(...) 推入了多个请求拦截器时
        // this.interceptors.request 这里面就有多个拦截器，通过遍历拦截器，插入 chain 数组的前面
        this.interceptors.request.forEach((interceptor) => {
            chain.unshift(interceptor)
        })
        // 当用户使用 axios.interceptors.response.use(...) 推入多个响应拦截器时
        // this.interceptors.response 这里面就有多个拦截器，通过遍历拦截器，插入 chain 数组的后面
        this.interceptors.response.forEach((interceptor) => {
            chain.push(interceptor)
        })

        let promise = Promise.resolve(config);

        while (chain.length) {
            const { resolved, rejected } = chain.shift();
            promise = promise.then(resolved, rejected)
        }
        
        return promise;
    }

    get() {
        return this._requestMethodWithoutData('get', url, config);
    }

    delete() {
        return this._requestMethodWithoutData('delete', url, config);
    }

    head() {
        return this._requestMethodWithoutData('head', url, config);
    }

    options() {
        return this._requestMethodWithoutData('options', url, config);
    }

    post() {
        return this._requestMethodWithData('post', url, data, config);
    }

    put() {
        return this._requestMethodWithData('put', url, data, config);
    }

    patch() {
        return this._requestMethodWithData('patch', url, data, config);
    }

    _requestMethodWithoutData(method, url, config) {
        return this.request(
            Object.assign(config || {}, {
                method,
                url
            })
        )
    }

    _requestMethodWithData(method, url, data, config) {
        return this.request(
            Object.assign(config || {}, {
                method,
                url,
                data
            })
        )
    }
}



export default Axios;