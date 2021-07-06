/**
 * @file 注册数据返回处理相关勾子
 */

// Types
import {Hooks, RequestConfig} from './BaseRequest';
import {AxiosResponse} from 'axios';

/**
 * 响应体预处理
 * @param hooks 控制请求流程的勾子集合
 */
export function resData(hooks: Hooks) {
    hooks.responseSuccess.tapPromise('status_200', (res: AxiosResponse) => {
        if (res.status !== 200) {
            return Promise.reject(res);
        }
        const config: RequestConfig = res.config;
        const body = res.data;
        const status = Number(body.code !== undefined ? body.code : body.status);
        // opt.originalRes 是否resolve原始response
        let resolveCfg = config.originalRes || false;

        // 处理文件
        if (config.responseType === 'arraybuffer') {
            return Promise.resolve(body);
        }

        if (status === 0) {
            return Promise.resolve(resolveCfg ? res : body);
        }

        // ...

        return Promise.reject(body);
    });
}
