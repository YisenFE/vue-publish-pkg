/**
 * @file cookie相关工具方法
 */

/**
 * 读取一个cookie
 * @param name 读取的cookie名
 * @returns 读取的值
 */
export function getCookie(name: string) {
    let arr;
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    return (arr = reg.exec(document.cookie)) ? unescape(arr[2]) : '';
}
