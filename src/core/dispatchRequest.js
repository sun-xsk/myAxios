import { transformRequest, transformResponse } from "../helpers/data.js"
import { processHeaders,flattenHeaders} from "../helpers/headers.js";
import { buildURL } from "../helpers/url.js";
import {xhr} from "../adapters/xhr.js";

const transformURL = (config) => {
    const { url, prams } = config;
    return buildURL(url, prams)
}

const transformHeaders = (config) => {
    const { headers = {}, data } = config;
    return processHeaders(headers, data);
}

const transformRequestData = (config) => {
    return transformRequest(config.data);
}

const processConfig = (config) => {
    config.url = transformURL(config);
    config.data = transformRequestData(config);
    config.headers = transformHeaders(config);
    config.headers = flattenHeaders(config.headers, config.method);
}

// 转换输出数据函数
const transformResponseData = (res) => {
    res.data = transformResponse(res.data);
    return res;
};

const getDefaultAdapter = () =>{
    // let adapter;
    // if(typeof XMLHttpRequest !== 'undefined'){
    //     adapter = require("../adapters/xhr.js")
    // }else if(typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]'){
    //     adapter = require("../adapters/http");
    // }
    // return adapter;
    return xhr;
}

const dispatchRequest = (config) => {
    const adapter = config.adapter || getDefaultAdapter()
    // 处理传入的配置
    processConfig(config);
    // 发送请求
    return adapter(config).then((res) => transformResponseData(res));
};

export default dispatchRequest;