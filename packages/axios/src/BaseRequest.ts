/**
 * @file 底层封装请求方法
 * NOTE: 采用tapable设置拦截器
 */

// Types
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {SyncHook, SyncWaterfallHook, AsyncSeriesWaterfallHook} from 'tapable';

// Utils
import {parsePath} from './utils/parsePath';

export interface RequestConfig extends AxiosRequestConfig {
    /**
     * 是否允许接口跨页面生效
     */
    allowCrossPage?: boolean;
    /**
     * 请求头
     */
    otherHeaders?: Record<string, any>;
    /**
     * 是否返回原始响应体
     */
    originalRes?: boolean;
}

/**
 * 控制请求流程的勾子集合
 */
export type Hooks = Readonly<{
    /**
     * 请求前的勾子，勾子内部需要返回axios配置对象
     */
    beforeRequest: SyncWaterfallHook<RequestConfig>;
    /**
     * 返回后不管成功与否都会触发的勾子
     */
    responseImmediate: SyncHook<AxiosRequestConfig>;
    /**
     * 返回成功态后触发的勾子
     */
    responseSuccess: AsyncSeriesWaterfallHook<AxiosResponse>;
    /**
     * 捕获Promise失败态
     */
    responseFail: AsyncSeriesWaterfallHook<AxiosResponse>;
}>;

/**
 * 底层axios封装
 * 通过tapable，自定义流程配置
 */
export default class BaseRequest {
    axiosInstance: AxiosInstance = axios.create();
    /**
     * 控制请求流程的勾子集合
     */
    hooks: Hooks = Object.freeze({
        beforeRequest: new SyncWaterfallHook<RequestConfig>(['config']),
        responseImmediate: new SyncHook<RequestConfig>(['config']),
        responseSuccess: new AsyncSeriesWaterfallHook<AxiosResponse>(['response']),
        responseFail: new AsyncSeriesWaterfallHook<AxiosResponse>(['error']),
    });
    /**
     * 发送网络请求
     * @param url 接口路径
     * @param data 接口入参
     * @param opt 请求配置对象
     * @returns Promise
     */
    request = (
        url: string,
        data: Record<string, any> = {},
        opt: RequestConfig = {}
    ) => {
        const config = this.hooks.beforeRequest.call({
            url,
            data,
            method: opt.method || 'POST',
            responseType: opt.responseType,
            params: opt.method === 'GET' ? data : {}, // GET
            headers: {
                isajax: 'true',
                ...opt.headers,
                ...opt.otherHeaders,
            },
            timeout: 1000 * 30,
            allowCrossPage: opt.allowCrossPage || false, // 是否允许切换路由之后，仍处理上个路由的请求，默认不允许
            ...opt,
        });

        // 发送请求当前页面hash
        let hashFrom = parsePath().path || '';
        return this.axiosInstance(config)
            .finally(() => {
                this.hooks.responseImmediate.call(config);
            })
            .then(res => {
                // 请求返回时页面hash
                let hashTo = parsePath().path || '';
                // 解决路由切换后，上个页面promise仍然返回问题
                if ((hashFrom !== hashTo) && !config.allowCrossPage) {
                    return;
                }
                return this.hooks.responseSuccess.promise(res);
            })
            .catch(err => {
                let hashTo = parsePath().path || '';
                // 解决路由切换后，上个页面promise仍然返回问题
                if ((hashFrom !== hashTo) && !config.allowCrossPage) {
                    return;
                }
                return this.hooks.responseFail.promise(err);
            });
    };
}
