import dispatchRequest from "./dispatchRequest.js";
import InterceptorManager from "./InterceptorManager.js";
import mergeConfig from "./mergeConfig.js";

class Axios {
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
                resolved: dispatchRequest.bind(this,config),
                rejected: undefined
            }
        ];

        this.interceptors.request.forEach((interceptor) => {
            chain.unshift(interceptor)
        })
        
        this.interceptors.response.forEach((interceptor) => {
            chain.push(interceptor)
        })

        let promise = Promise.resolve();
     
        while (chain.length) {
            const { resolved, rejected } = chain.shift();
            promise = promise.then(resolved, rejected);
        }

        return promise;
    }

    get(url, config) {
        return this._requestMethodWithoutData('get', url, config);
    }

    delete(url, config) {
        return this._requestMethodWithoutData('delete', url, config);
    }

    head(url, config) {
        return this._requestMethodWithoutData('head', url, config);
    }

    options(url, config) {
        return this._requestMethodWithoutData('options', url, config);
    }

    post(url, config) {
        return this._requestMethodWithData('post', url, data, config);
    }

    put(url, config) {
        return this._requestMethodWithData('put', url, data, config);
    }

    patch(url, config) {
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