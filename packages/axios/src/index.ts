/**
 * @file 批量导出，封装好的请求方法，供业务测使用
 */

import request from './request';
import BaseRequest from './BaseRequest';

const baseRequest = new BaseRequest();

export {
    request,
    baseRequest,
};

export default request;
