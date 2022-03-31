import { isURLSearchParams, isDate, isPlainObject } from './utils.js';

export const encode = (val) => {
    return encodeURIComponent(val)
        .replace(/%40/g, "@")
        .replace(/%3A/gi, ":")
        .replace(/%24/g, "$")
        .replace(/%2C/gi, ",")
        .replace(/%20/g, "+")
        .replace(/%5B/gi, "[")
        .replace(/%5D/gi, "]");
};


export const buildURL = (url, params) => {
    // 如果 params 参数为空，则直接返回原 URL
    if (!params) {
        return url;
    }
    // 定义一个变量，用来保存最终拼接后的参数
    let serializedParams;
    // 检测 params 是不是 URLSearchParams 对象类型
    if (isURLSearchParams(params)) {
        // 如果是（例如：new URLSearchParams(topic=api&foo=bar)），则 params 直接序列化输出
        serializedParams = params.toString();
    } else {
        // 如果不是则进入该主体运行
        // 定义一个数组
        const parts = [];
        // Object.keys 可以获取一个对象的所有key的数组，通过 forEach 进行遍历
        Object.keys(params).forEach((key) => {
            // 获取每个key对象的val
            const val = params[key];
            // 如果 val 是 null，或者是 undefined 则终止这轮循环，进入下轮循环，这里就是忽略空值操作
            if (val === null || typeof val === "undefined") {
                return;
            }
            // 定义一个数组
            let values = [];
            // 判断 val 是否是一个数组类型
            if (Array.isArray(val)) {
                // 是的话，values空数组赋值为 val，并且 key 拼接上[]
                values = val;
                key += "[]";
            } else {
                // val 不是数组的话，也让它变为数组，抹平数据类型不同的差异，方便后面统一处理
                values = [val];
            }
            // 由于前面抹平差异，这里可以统一当做数组进行处理
            values.forEach((val) => {
                // 如果 val 是日期对象，
                if (isDate(val)) {
                    // toISOString返回Date对象的标准的日期时间字符串格式的字符串
                    val = val.toISOString();
                    // 如果 val 是对象类型的话，直接序列化
                } else if (isPlainObject(val)) {
                    val = JSON.stringify(val);
                }
                // 处理结果推入数组
                parts.push(`${encode(key)}=${encode(val)}`);
            });
        });
        // 最后拼接数组
        serializedParams = parts.join("&");
    }

    if (serializedParams) {
        // 处理 hash 的情况
        const markIndex = url.indexOf("#");
        if (markIndex !== -1) {
            url = url.slice(0, markIndex);
        }
        // 处理，如果传入已经带有参数，则拼接在其后面，否则要手动添加上一个 ?
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    // 输出完整的 URL
    return url;
};