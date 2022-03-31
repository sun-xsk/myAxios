import { deepMerge, isPlainObject } from '../helpers/utils.js';

const strats = Object.create(null);

// 默认策略：val2即用户配置不为空则使用用户配置，否则使用val1默认配置
function defaultStrat(val1, val2) {
    return typeof val2 !== 'undefined' ? val2 : val1
}

// 'url', 'params', 'data' 这三种属性，只使用用户配置
function fromVal2Strat(val1, val2) {
    if (typeof val2 !== 'undefined') {
        return val2
    }
}

function deepMergeStrat(val1, val2) {
    if (isPlainObject(val2)) {
        return deepMerge(val1, val2)
    } else if (typeof val2 !== 'undefined') {
        return val2
    } else if (isPlainObject(val1)) {
        return deepMerge(val1)
    } else {
        return val1
    }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']


stratKeysDeepMerge.forEach(key => {
    strats[key] = deepMergeStrat
})

export default function mergeConfig(config1,config2) {
    if (!config2) {
        config2 = {}
    }
    // 创建一个空对象，用来存储最终合并好的配置文件
    const config = Object.create(null)
    // 遍历用户配置，mergeField方法就是根据属性选择到不同的策略，进行合并配置
    for (let key in config2) {
        mergeField(key)
    }
    // 遍历默认配置，并且该配置没有在用户配置中出现的
    for (let key in config1) {
        if (!config2[key]) {
            mergeField(key)
        }
    }
    // 这里采用的是设计模式中的“策略模式”，有效的剔除了代码中无限个 if else 的情况
    function mergeField(key) {
        const strat = strats[key] || defaultStrat
        config[key] = strat(config1[key], config2[key])
    }
    // 导出最终的config
    return config
}


