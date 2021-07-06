/**
 * @file 包装请求
 */

// Modules
import BaseRequest from './BaseRequest';
import {addRequestHeader} from './addRequestHeader';
import {resData} from './resData';

const {request, hooks} = new BaseRequest();
addRequestHeader(hooks);
resData(hooks);

export default request;
