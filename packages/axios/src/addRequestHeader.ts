/**
 * @file 注册请求头勾子
 */

// Types
import {Hooks} from './BaseRequest';

// Utils
import {getCookie} from './utils/cookie';
import {getWebHeader, getClientHeader} from './utils/header';

/**
 * 添加请求头
 * @param hooks 控制请求流程的勾子集合
 */
export function addRequestHeader(hooks: Hooks) {
    const commonHeader = !getCookie('env')
        ? getWebHeader()
        : getClientHeader();
    hooks.beforeRequest.tap('addRequestHeader', config => {
        config.headers = {
            ...commonHeader,
            ...config.headers,
        };
        return config;
    });
}

