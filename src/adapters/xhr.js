import { parseHeaders } from '../helpers/headers.js';


// 请求模板

export const xhr= (config) => {
    return new Promise((resolve, reject) => {
        const { 
            data = null,
            url,
            method = 'get',
            headers = {},
            responseType,
            timeout,
        } = config;

        const request = new XMLHttpRequest();

        if (responseType) {
            request.responseType = responseType;
        }
        if (timeout) {
            request.timeout = timeout;
        }
        request.open(method.toUpperCase(), url, true);
        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return
            }
            if (request.status === 0) {
                return
            }
            const responseHeaders = parseHeaders(request.getAllResponseHeaders());

            const responseData =
                responseType && responseType !== 'text' ? request.response : request.responseText;
            const response = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else {
                reject();
            }
        }
        // headers处理
        Object.keys(headers).forEach((name) => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name]);
            }
        })
        request.send(data);
    })
}

