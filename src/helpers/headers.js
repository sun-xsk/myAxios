import {isPlainObject , deepMerge} from './utils.js';

export const normalizeHeaderName = (headers, normalizedName) => {
    if (!headers) {
        return
    }

    Object.keys(headers).forEach(name => {
        // 统一使用Content-Type
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    });
}

export const processHeaders = (headers, data) => {
    normalizeHeaderName(headers, 'Content-Type')
    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}

export const parseHeaders = (headers) => {
    let parsed = Object.create(null);
    if (!headers) {
      return parsed;
    }
  
    headers.split("\r\n").forEach((line) => {
      let [key, ...vals] = line.split(":");
      key = key.trim().toLowerCase();
      if (!key) {
        return;
      }
      parsed[key] = vals.join(":").trim();
    });
  
    return parsed;
  };

  export const flattenHeaders = (headers, method) => {
    if (!headers) {
      return headers;
    }
    headers = deepMerge(headers.common, headers[method], headers);
  
    const methodsToDelete = [
      "delete",
      "get",
      "head",
      "options",
      "post",
      "put",
      "patch",
      "common",
    ];
  
    methodsToDelete.forEach((method) => {
      delete headers[method];
    });
  
    return headers;
  };
  