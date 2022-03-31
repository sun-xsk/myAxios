import {isPlainObject} from './utils.js';

export const transformRequest = (data) => {
    if (isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
}

export const transformResponse = (data) => {
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }
    return data;
  };

