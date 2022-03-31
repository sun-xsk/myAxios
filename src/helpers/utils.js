export const isDate=(val)=> {
    return toString.call(val) === '[object Date]'
}

export const isPlainObject=(val)=> {
    return toString.call(val) === '[object Object]'
}

export const isURLSearchParams=(val)=> {
    return typeof val !== 'undefined' && val instanceof URLSearchParams
}

export const extend=(to, from, ctx)=> {
    // 继承方法
    Object.getOwnPropertyNames(from).forEach((key) => {
        to[key] = from[key].bind(ctx)
    })

    // 继承ctx自身属性
    for (let key in ctx) {
        if (ctx.hasOwnProperty(key)) {
            to[key] = ctx[key];
        }
    }
    return to;
}

export const deepMerge = (...objs) => {
    const result = Object.create(null);
    objs.forEach((obj) => {
      if (obj) {
        Object.keys(obj).forEach((key) => {
          const val = obj[key];
          if (isPlainObject(val)) {
            if (isPlainObject(result[key])) {
              result[key] = deepMerge(result[key], val);
            } else {
              result[key] = deepMerge(val);
            }
          } else {
            result[key] = val;
          }
        });
      }
    });
  
    return result;
  };
