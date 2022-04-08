import Axios from "./core/Axios.js";
import {extend} from "./helpers/utils.js";
import defaults from "./defaults.js";
import mergeConfig from "./core/mergeConfig.js";

// 创建我的axios
function createInstance(config) {
    // 创建实例
    const context = new Axios(config);

    // 变量 instance 保存了 Axios 类上的 request 方法，并使用上一步实例化的对象去接替该方法中的 this。
    const instance = Axios.prototype.request.bind(context);

    // 方法继承
    extend(instance, Axios.prototype, context);


    instance.create = function (config) {
        return createInstance(mergeConfig(defaults, config));
    }

    // 实际返回的是request方法
    return instance;

}


// 构造我的Axios
const axios = createInstance(defaults);


export default axios;






